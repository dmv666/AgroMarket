import { useEffect } from "react";
import { IconClose } from "./icons";

/**
 * Antes, ver un documento de verificación en tamaño completo abría una
 * pestaña nueva y sacaba al admin del panel — para revisar varias
 * solicitudes seguidas eso es fricción innecesaria. Esto lo mantiene en el
 * mismo lugar.
 */
export function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-ink/80 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full bg-surface/90 p-2 text-ink hover:bg-surface"
        aria-label="Cerrar"
      >
        <IconClose className="h-5 w-5" />
      </button>
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-lifted"
      />
    </div>
  );
}
