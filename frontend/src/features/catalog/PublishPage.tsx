import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Dropzone } from "@/shared/ui/Dropzone";
import { Input, Select, Textarea } from "@/shared/ui/Field";
import { CATEGORIA_ICONOS, IconCheck } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";
import { usePublicacion, useCrearPublicacion, useSubirImagen } from "./api";
import { CATEGORIA_LABEL } from "./labels";
import type { Categoria } from "@/shared/api/types";

type Detalle = Record<string, string>;

const DETALLE_INICIAL: Record<Categoria, Detalle> = {
  insumo_veterinario: { tipo_insumo: "", fabricante: "", fecha_vencimiento: "" },
  alimento_balanceado: { tipo_alimento: "", presentacion: "", peso_kg: "" },
  animal_genetica: { especie: "", raza: "", edad: "", estado_salud: "", tipo_genetica: "cria" },
};

export function PublishPage() {
  const crear = useCrearPublicacion();
  const [categoria, setCategoria] = useState<Categoria>("insumo_veterinario");
  const [detalle, setDetalle] = useState<Detalle>(DETALLE_INICIAL.insumo_veterinario);
  const [comun, setComun] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    cantidad_disponible: "1",
    ubicacion: "",
  });
  const [publicacionCreadaId, setPublicacionCreadaId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function cambiarCategoria(nueva: Categoria) {
    setCategoria(nueva);
    setDetalle(DETALLE_INICIAL[nueva]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const detalleLimpio = Object.fromEntries(Object.entries(detalle).filter(([, valor]) => valor !== ""));
      const creada = await crear.mutateAsync({
        categoria,
        titulo: comun.titulo,
        descripcion: comun.descripcion,
        precio: comun.precio,
        cantidad_disponible: Number(comun.cantidad_disponible) || 1,
        ubicacion: comun.ubicacion,
        detalle: detalleLimpio,
      });
      setPublicacionCreadaId(creada.id);
    } catch {
      setError("Revisa los campos requeridos (recuerda: los animales necesitan estado de salud).");
    }
  }

  if (publicacionCreadaId) {
    return <PasoFotos publicacionId={publicacionCreadaId} />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold">Publica lo que ofreces</h1>
        <p className="text-sm text-muted">Toma menos de cinco minutos y queda visible en cuanto un administrador la revise.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Seccion numero={1} titulo="¿Qué categoría es?">
          <div className="grid grid-cols-3 gap-2.5">
            {(Object.keys(CATEGORIA_LABEL) as Categoria[]).map((valor) => {
              const Icono = CATEGORIA_ICONOS[valor];
              const activa = categoria === valor;
              return (
                <button
                  type="button"
                  key={valor}
                  onClick={() => cambiarCategoria(valor)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 text-center text-xs font-medium transition-colors ${
                    activa ? "border-primary bg-success-bg text-ink" : "border-line text-muted hover:border-primary/50"
                  }`}
                >
                  <Icono className={`h-6 w-6 ${activa ? "text-primary" : "text-muted"}`} />
                  {CATEGORIA_LABEL[valor]}
                </button>
              );
            })}
          </div>
        </Seccion>

        <Seccion numero={2} titulo="Información básica">
          <Input
            etiqueta="Título"
            required
            placeholder="Ej. Novillas F1 Brahman x Angus"
            value={comun.titulo}
            onChange={(e) => setComun((c) => ({ ...c, titulo: e.target.value }))}
          />
          <Textarea
            etiqueta="Descripción"
            placeholder="Cuenta el estado, procedencia y cualquier detalle que ayude a decidir"
            value={comun.descripcion}
            onChange={(e) => setComun((c) => ({ ...c, descripcion: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              etiqueta="Precio (COP)"
              type="number"
              required
              value={comun.precio}
              onChange={(e) => setComun((c) => ({ ...c, precio: e.target.value }))}
            />
            <Input
              etiqueta="Cantidad disponible"
              type="number"
              min={1}
              value={comun.cantidad_disponible}
              onChange={(e) => setComun((c) => ({ ...c, cantidad_disponible: e.target.value }))}
            />
          </div>
          <Input
            etiqueta="Ubicación"
            required
            placeholder="Municipio, departamento"
            value={comun.ubicacion}
            onChange={(e) => setComun((c) => ({ ...c, ubicacion: e.target.value }))}
          />
        </Seccion>

        <Seccion numero={3} titulo={`Detalles de ${CATEGORIA_LABEL[categoria].toLowerCase()}`}>
          <CamposDetalle categoria={categoria} detalle={detalle} onChange={setDetalle} />
        </Seccion>

        {error && (
          <p className="mb-4 rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>
        )}
        <Button type="submit" disabled={crear.isPending} className="w-full">
          {crear.isPending ? "Publicando..." : "Continuar"}
        </Button>
      </form>
    </div>
  );
}

function Seccion({ numero, titulo, children }: { numero: number; titulo: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-ink">
          {numero}
        </span>
        <h2 className="font-display text-base font-semibold text-ink">{titulo}</h2>
      </div>
      <Card>{children}</Card>
    </div>
  );
}

function PasoFotos({ publicacionId }: { publicacionId: number }) {
  const { data: publicacion } = usePublicacion(publicacionId);
  const subirImagen = useSubirImagen(publicacionId);
  const { notificar } = useToast();
  const [pendientes, setPendientes] = useState<File[]>([]);
  const [subiendo, setSubiendo] = useState(false);

  async function subirTodas() {
    setSubiendo(true);
    try {
      for (const archivo of pendientes) {
        await subirImagen.mutateAsync(archivo);
      }
      setPendientes([]);
      notificar("Fotos agregadas.");
    } catch {
      notificar("Algunas fotos no se pudieron subir. Intenta de nuevo.", "danger");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-2.5 rounded-xl bg-success-bg px-4 py-3">
        <IconCheck className="h-5 w-5 flex-none text-success" />
        <p className="text-sm text-ink">
          <span className="font-semibold">Publicación creada</span> — quedó pendiente de revisión.
        </p>
      </div>

      <Seccion numero={4} titulo="Agrega fotos">
        {publicacion && publicacion.imagenes.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {publicacion.imagenes.map((img) => (
              <img key={img.id} src={img.archivo} alt="" className="h-20 w-20 rounded-lg object-cover" />
            ))}
          </div>
        )}
        <Dropzone
          etiqueta="Fotos del producto"
          ayuda="Publicaciones con foto reciben más contactos"
          accept="image/*"
          multiple
          archivos={pendientes}
          onChange={setPendientes}
        />
        {pendientes.length > 0 && (
          <Button onClick={subirTodas} disabled={subiendo} className="w-full">
            {subiendo ? "Subiendo..." : `Subir ${pendientes.length} foto${pendientes.length === 1 ? "" : "s"}`}
          </Button>
        )}
      </Seccion>

      <Link
        to={`/publicaciones/${publicacionId}`}
        className="block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-ink"
      >
        Ver mi publicación
      </Link>
    </div>
  );
}

function CamposDetalle({
  categoria,
  detalle,
  onChange,
}: {
  categoria: Categoria;
  detalle: Detalle;
  onChange: (d: Detalle) => void;
}) {
  const set = (campo: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    onChange({ ...detalle, [campo]: e.target.value });

  if (categoria === "insumo_veterinario") {
    return (
      <>
        <Input etiqueta="Tipo de insumo" required value={detalle.tipo_insumo} onChange={set("tipo_insumo")} />
        <Input etiqueta="Fabricante" value={detalle.fabricante} onChange={set("fabricante")} />
        <Input
          etiqueta="Fecha de vencimiento"
          type="date"
          value={detalle.fecha_vencimiento}
          onChange={set("fecha_vencimiento")}
        />
      </>
    );
  }

  if (categoria === "alimento_balanceado") {
    return (
      <>
        <Input etiqueta="Tipo de alimento" required value={detalle.tipo_alimento} onChange={set("tipo_alimento")} />
        <Input etiqueta="Presentación" required value={detalle.presentacion} onChange={set("presentacion")} />
        <Input etiqueta="Peso (kg)" type="number" required value={detalle.peso_kg} onChange={set("peso_kg")} />
      </>
    );
  }

  return (
    <>
      <Input etiqueta="Especie" required value={detalle.especie} onChange={set("especie")} />
      <Input etiqueta="Raza" required value={detalle.raza} onChange={set("raza")} />
      <Input etiqueta="Edad" required placeholder="Ej. 18 meses" value={detalle.edad} onChange={set("edad")} />
      <Select etiqueta="Tipo" value={detalle.tipo_genetica} onChange={set("tipo_genetica")}>
        <option value="cria">Cría</option>
        <option value="reproductor">Reproductor</option>
        <option value="semen">Semen</option>
      </Select>
      <Textarea
        etiqueta="Estado de salud (obligatorio)"
        placeholder="Vacunas, estado corporal, cualquier condición relevante"
        required
        value={detalle.estado_salud}
        onChange={set("estado_salud")}
      />
    </>
  );
}
