import { useState, type FormEvent } from "react";
import { useAuth } from "@/shared/auth/AuthContext";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Input, Select } from "@/shared/ui/Field";
import { useEnviarVerificacion } from "./api";

const ESTADO_TONO = { pendiente: "warning", aprobado: "success", rechazado: "danger" } as const;
const ESTADO_TEXTO = {
  pendiente: "Pendiente de revisión",
  aprobado: "Verificado",
  rechazado: "Rechazada — vuelve a intentarlo",
};

export function VerificationPanel() {
  const { usuario, refrescarUsuario } = useAuth();
  const enviar = useEnviarVerificacion();
  const [tipoDocumento, setTipoDocumento] = useState("cedula");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);

  if (!usuario) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!archivo) return;
    await enviar.mutateAsync({
      tipo_documento: tipoDocumento,
      numero_documento: numeroDocumento,
      documento_identidad_archivo: archivo,
    });
    await refrescarUsuario();
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-semibold">Estado de verificación (RF01)</span>
        <Badge tono={ESTADO_TONO[usuario.estado_verificacion]}>{ESTADO_TEXTO[usuario.estado_verificacion]}</Badge>
      </div>

      {usuario.estado_verificacion !== "aprobado" && (
        <form onSubmit={handleSubmit}>
          <p className="mb-3 text-xs text-muted">
            No puedes publicar ni contactar vendedores hasta que un administrador apruebe tu documento.
          </p>
          <Select etiqueta="Tipo de documento" value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
            <option value="cedula">Cédula de ciudadanía</option>
            <option value="cedula_extranjeria">Cédula de extranjería</option>
            <option value="nit">NIT</option>
          </Select>
          <Input
            etiqueta="Número de documento"
            required
            value={numeroDocumento}
            onChange={(e) => setNumeroDocumento(e.target.value)}
          />
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              Foto o escaneo del documento
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              required
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
              className="block w-full text-sm"
            />
          </div>
          <Button type="submit" disabled={enviar.isPending}>
            {enviar.isPending ? "Enviando..." : "Enviar para revisión"}
          </Button>
        </form>
      )}
    </div>
  );
}
