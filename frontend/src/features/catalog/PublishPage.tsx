import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input, Select, Textarea } from "@/shared/ui/Field";
import { useCrearPublicacion, useSubirImagen } from "./api";
import { CATEGORIA_LABEL } from "./labels";
import type { Categoria } from "@/shared/api/types";

type Detalle = Record<string, string>;

const DETALLE_INICIAL: Record<Categoria, Detalle> = {
  insumo_veterinario: { tipo_insumo: "", fabricante: "", fecha_vencimiento: "" },
  alimento_balanceado: { tipo_alimento: "", presentacion: "", peso_kg: "" },
  animal_genetica: { especie: "", raza: "", edad: "", estado_salud: "", tipo_genetica: "cria" },
};

export function PublishPage() {
  const navigate = useNavigate();
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
  const subirImagen = useSubirImagen(publicacionCreadaId ?? 0);
  const [error, setError] = useState<string | null>(null);

  function cambiarCategoria(nueva: Categoria) {
    setCategoria(nueva);
    setDetalle(DETALLE_INICIAL[nueva]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const detalleLimpio = Object.fromEntries(
        Object.entries(detalle).filter(([, valor]) => valor !== ""),
      );
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
    return (
      <div className="mx-auto max-w-lg">
        <Card>
          <h1 className="mb-2 font-display text-xl font-semibold">¡Publicación creada!</h1>
          <p className="mb-4 text-sm text-muted">
            Quedó pendiente de revisión por un administrador (RF09). Puedes agregar fotos ahora.
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              Array.from(e.target.files ?? []).forEach((archivo) => subirImagen.mutate(archivo));
            }}
            className="mb-4 block w-full text-sm"
          />
          <Button onClick={() => navigate(`/publicaciones/${publicacionCreadaId}`)}>Ver mi publicación</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <h1 className="mb-1 font-display text-2xl font-semibold">¿Qué vas a ofrecer?</h1>
        <p className="mb-6 text-sm text-muted">Los campos varían según la categoría.</p>
        <form onSubmit={handleSubmit}>
          <Select
            etiqueta="Categoría"
            value={categoria}
            onChange={(e) => cambiarCategoria(e.target.value as Categoria)}
          >
            {Object.entries(CATEGORIA_LABEL).map(([valor, label]) => (
              <option key={valor} value={valor}>
                {label}
              </option>
            ))}
          </Select>
          <Input
            etiqueta="Título"
            required
            value={comun.titulo}
            onChange={(e) => setComun((c) => ({ ...c, titulo: e.target.value }))}
          />
          <Textarea
            etiqueta="Descripción"
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

          <CamposDetalle categoria={categoria} detalle={detalle} onChange={setDetalle} />

          {error && <p className="mb-4 text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={crear.isPending} className="w-full">
            {crear.isPending ? "Publicando..." : "Publicar"}
          </Button>
        </form>
      </Card>
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
        etiqueta="Estado de salud (obligatorio, RF04)"
        required
        value={detalle.estado_salud}
        onChange={set("estado_salud")}
      />
    </>
  );
}
