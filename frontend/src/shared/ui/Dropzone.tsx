import { useRef, useState, type DragEvent } from "react";
import { IconClose, IconUpload } from "./icons";

interface DropzoneProps {
  etiqueta: string;
  ayuda?: string;
  accept?: string;
  multiple?: boolean;
  archivos: File[];
  onChange: (archivos: File[]) => void;
  error?: string;
}

/**
 * Zona de arrastrar-y-soltar con vista previa de lo seleccionado. El input
 * file nativo es prácticamente invisible cuando algo sale mal (sin
 * feedback de qué se eligió, sin aviso si falta) — esto reemplaza ese
 * patrón en los dos lugares donde el usuario sube un archivo: verificación
 * de identidad y fotos de publicación.
 */
export function Dropzone({ etiqueta, ayuda, accept, multiple, archivos, onChange, error }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [arrastrando, setArrastrando] = useState(false);

  function agregar(lista: FileList | null) {
    if (!lista || lista.length === 0) return;
    const nuevos = Array.from(lista);
    onChange(multiple ? [...archivos, ...nuevos] : nuevos.slice(0, 1));
  }

  function quitar(indice: number) {
    onChange(archivos.filter((_, i) => i !== indice));
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setArrastrando(false);
    agregar(e.dataTransfer.files);
  }

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">{etiqueta}</label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
          arrastrando ? "border-primary bg-success-bg" : error ? "border-danger/60 bg-danger-bg/40" : "border-line bg-bg hover:border-primary/60"
        }`}
      >
        <IconUpload className="h-5 w-5 text-muted" />
        <p className="text-sm text-ink">
          <span className="font-semibold text-primary">Elige un archivo</span> o arrástralo aquí
        </p>
        {ayuda && <p className="text-xs text-muted">{ayuda}</p>}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => agregar(e.target.files)}
        />
      </div>

      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}

      {archivos.length > 0 && (
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {archivos.map((archivo, indice) => (
            <li
              key={`${archivo.name}-${indice}`}
              className="flex items-center gap-2 rounded-lg border border-line bg-surface py-1.5 pl-2.5 pr-1.5 text-xs"
            >
              {archivo.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(archivo)}
                  alt=""
                  className="h-6 w-6 rounded object-cover"
                />
              ) : (
                <span className="text-muted">📄</span>
              )}
              <span className="max-w-36 truncate">{archivo.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  quitar(indice);
                }}
                className="rounded-full p-0.5 text-muted hover:bg-surface-2 hover:text-ink"
                aria-label={`Quitar ${archivo.name}`}
              >
                <IconClose className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
