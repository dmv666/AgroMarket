import { useState } from "react";
import { Input } from "@/shared/ui/Field";
import { CATEGORIA_ICONOS } from "@/shared/ui/icons";
import { usePublicaciones, type FiltrosCatalogo } from "./api";
import { CATEGORIA_LABEL } from "./labels";
import { PublicacionCard } from "./PublicacionCard";

type Categoria = keyof typeof CATEGORIA_LABEL;

export function CatalogPage() {
  const [filtros, setFiltros] = useState<FiltrosCatalogo>({});
  const { data, isLoading } = usePublicaciones(filtros);

  function actualizar(campo: keyof FiltrosCatalogo, valor: string) {
    setFiltros((f) => ({ ...f, [campo]: valor || undefined }));
  }

  function alternarCategoria(categoria: Categoria) {
    setFiltros((f) => ({ ...f, categoria: f.categoria === categoria ? undefined : categoria }));
  }

  const hayFiltrosActivos = Object.values(filtros).some(Boolean);

  return (
    <div>
      <section className="-mx-4 mb-8 bg-primary px-4 py-10 text-primary-ink sm:-mx-6 sm:px-6 sm:py-14 sm:rounded-2xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Compra y vende directo, sin intermediarios ni desconfianza
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-primary-ink/80 sm:text-base">
            Insumos veterinarios, alimento balanceado y animales de productores y proveedores
            verificados en todo el país.
          </p>
        </div>

        <div className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-2.5">
          {(Object.keys(CATEGORIA_LABEL) as Categoria[]).map((categoria) => {
            const Icono = CATEGORIA_ICONOS[categoria];
            const activa = filtros.categoria === categoria;
            return (
              <button
                key={categoria}
                onClick={() => alternarCategoria(categoria)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  activa
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-primary-ink/25 bg-primary-ink/10 text-primary-ink hover:bg-primary-ink/20"
                }`}
              >
                <Icono className="h-4 w-4" />
                {CATEGORIA_LABEL[categoria]}
              </button>
            );
          })}
        </div>
      </section>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="w-40">
          <Input etiqueta="Ubicación" placeholder="Municipio o depto." onChange={(e) => actualizar("ubicacion", e.target.value)} />
        </div>
        <div className="w-32">
          <Input etiqueta="Precio mín." type="number" onChange={(e) => actualizar("precio_min", e.target.value)} />
        </div>
        <div className="w-32">
          <Input etiqueta="Precio máx." type="number" onChange={(e) => actualizar("precio_max", e.target.value)} />
        </div>
        {hayFiltrosActivos && (
          <button onClick={() => setFiltros({})} className="mb-4 text-xs font-semibold text-primary underline underline-offset-2">
            Quitar filtros
          </button>
        )}
        <span className="mb-4 ml-auto text-xs text-muted">
          {isLoading ? "Buscando..." : `${data?.count ?? 0} publicación${data?.count === 1 ? "" : "es"}`}
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="aspect-[4/3] animate-pulse bg-surface-2" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-16 animate-pulse rounded bg-surface-2" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-surface-2" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-surface-2" />
              </div>
            </div>
          ))}
        </div>
      ) : !data || data.results.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 py-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">Nada por aquí todavía</p>
          <p className="max-w-sm text-sm text-muted">
            No hay publicaciones que coincidan con estos filtros. Prueba a ampliarlos o quítalos.
          </p>
          {hayFiltrosActivos && (
            <button onClick={() => setFiltros({})} className="text-sm font-semibold text-primary underline underline-offset-2">
              Ver todo el catálogo
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.results.map((p) => (
            <PublicacionCard key={p.id} publicacion={p} />
          ))}
        </div>
      )}
    </div>
  );
}
