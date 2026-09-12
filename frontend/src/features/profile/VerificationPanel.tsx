import { useState, type FormEvent } from "react";
import { useAuth } from "@/shared/auth/AuthContext";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Dropzone } from "@/shared/ui/Dropzone";
import { Input, Select } from "@/shared/ui/Field";
import { IconClock, IconShieldCheck } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";
import { useEnviarVerificacion } from "./api";
import { TIPO_DOCUMENTO_LABEL } from "./labels";

const ESTADO_TONO = { pendiente: "warning", aprobado: "success", rechazado: "danger" } as const;
const ESTADO_TEXTO = {
  pendiente: "Pendiente de revisión",
  aprobado: "Identidad verificada",
  rechazado: "Rechazada — corrige y reenvía",
};

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleString("es-CO", { day: "numeric", month: "long", hour: "numeric", minute: "2-digit" });
}

export function VerificationPanel() {
  const { usuario, refrescarUsuario } = useAuth();
  const enviar = useEnviarVerificacion();
  const { notificar } = useToast();
  const [tipoDocumento, setTipoDocumento] = useState("cedula");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [archivos, setArchivos] = useState<File[]>([]);
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  if (!usuario) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorServidor(null);

    if (archivos.length === 0) {
      setErrorArchivo("Adjunta una foto o escaneo de tu documento para continuar.");
      return;
    }
    setErrorArchivo(null);

    try {
      await enviar.mutateAsync({
        tipo_documento: tipoDocumento,
        numero_documento: numeroDocumento,
        documento_identidad_archivo: archivos[0],
      });
      await refrescarUsuario();
      setArchivos([]);
      setNumeroDocumento("");
      notificar("Documento enviado. Un administrador lo revisará en breve.");
    } catch {
      setErrorServidor("No se pudo enviar el documento. Revisa el número de documento e intenta de nuevo.");
    }
  }

  if (usuario.estado_verificacion === "aprobado") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-success-bg px-4 py-3.5">
        <IconShieldCheck className="h-6 w-6 flex-none text-success" />
        <div>
          <p className="text-sm font-semibold text-ink">Identidad verificada</p>
          <p className="text-xs text-muted">Puedes publicar y contactar a otros usuarios sin restricciones.</p>
        </div>
      </div>
    );
  }

  // Ya hay una solicitud radicada esperando revisión: no se ofrece el
  // formulario de nuevo (se prestaba a que el usuario reenviara el mismo
  // documento varias veces pensando que la primera vez no funcionó, tal
  // como reportó el usuario al probar el sistema).
  if (usuario.estado_verificacion === "pendiente" && usuario.fecha_solicitud_verificacion) {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-warning-bg px-4 py-3.5">
        <IconClock className="mt-0.5 h-6 w-6 flex-none text-warning" />
        <div>
          <p className="text-sm font-semibold text-ink">Tu verificación está en revisión</p>
          <p className="mt-1 text-xs text-muted">
            Enviada el {formatearFecha(usuario.fecha_solicitud_verificacion)}. Un administrador la revisará en un
            máximo de 48 horas — te avisaremos apenas se resuelva. Mientras tanto no puedes publicar ni contactar
            vendedores.
          </p>
        </div>
      </div>
    );
  }

  const esReenvio = usuario.estado_verificacion === "rechazado";

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-semibold">Verificación de identidad</span>
        {esReenvio && <Badge tono={ESTADO_TONO[usuario.estado_verificacion]}>{ESTADO_TEXTO[usuario.estado_verificacion]}</Badge>}
      </div>

      <form onSubmit={handleSubmit}>
        <p className="mb-4 text-sm text-muted">
          No puedes publicar ni contactar vendedores hasta que un administrador apruebe tu documento — normalmente
          se resuelve en menos de 48 horas.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Select etiqueta="Tipo de documento" value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
            {Object.entries(TIPO_DOCUMENTO_LABEL).map(([valor, label]) => (
              <option key={valor} value={valor}>
                {label}
              </option>
            ))}
          </Select>
          <Input
            etiqueta="Número de documento"
            required
            value={numeroDocumento}
            onChange={(e) => setNumeroDocumento(e.target.value)}
          />
        </div>

        <Dropzone
          etiqueta="Foto o escaneo del documento"
          ayuda="JPG, PNG o PDF"
          accept="image/*,.pdf"
          archivos={archivos}
          onChange={(lista) => {
            setArchivos(lista);
            if (lista.length > 0) setErrorArchivo(null);
          }}
          error={errorArchivo ?? undefined}
        />

        {errorServidor && <p className="mb-3 text-sm text-danger">{errorServidor}</p>}

        <Button type="submit" disabled={enviar.isPending}>
          {enviar.isPending ? "Enviando..." : "Enviar para revisión"}
        </Button>
      </form>
    </div>
  );
}
