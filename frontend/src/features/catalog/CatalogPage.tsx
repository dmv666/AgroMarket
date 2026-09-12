import { useState } from "react";
import { Select, Input } from "@/shared/ui/Field";
import { PantallaCargando } from "@/shared/ui/Spinner";
import { usePublicaciones, type FiltrosCatalogo } from "./api";
import { CATEGORIA_LABEL } from "./labels";
import { PublicacionCard } from "./PublicacionCard";

export function CatalogPage() {
  const [filtros, setFiltros] = useState<FiltrosCatalogo>({});
  const { data, isLoading } = usePublicaciones(filtros);

  function actualizar(campo: keyof FiltrosCatalogo, valor: string) {
    setFiltros((f) => ({ ...f, [campo]: valor || undefined }));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Lo que se está ofreciendo hoy</h1>
        <p className="text-sm text-muted">Insumos veterinarios, alimento balanceado y animales verificados.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Select etiqueta="Categoría" onChange={(e) => actualizar("categoria", e.target.value)}>
          <option value="">Todas</option>
          {Object.entries(CATEGORIA_LABEL).map(([valor, label]) => (
            <option key={valor} value={valor}>
              {label}
            </option>
          ))}
        </Select>
        <Input etiqueta="Ubicación" placeholder="Municipio o depto." onChange={(e) => actualizar("ubicacion", e.target.value)} />
        <Input etiqueta="Precio mínimo" type="number" onChange={(e) => actualizar("precio_min", e.target.value)} />
        <Input etiqueta="Precio máximo" type="number" onChange={(e) => actualizar("precio_max", e.target.value)} />
      </div>

      {isLoading ? (
        <PantallaCargando />
      ) : !data || data.results.length === 0 ? (
        <p className="mt-10 text-center text-muted">No hay publicaciones que coincidan con estos filtros.</p>
      ) : (
        <>
          <p className="mb-3 text-xs text-muted">{data.count} publicación(es) encontrada(s)</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.results.map((p) => (
              <PublicacionCard key={p.id} publicacion={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
