import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Field";
import { AuthLayout } from "./AuthLayout";

export function RegisterPage() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre_completo: "",
    email: "",
    password: "",
    telefono: "",
    ubicacion: "",
  });
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  function campo(nombre: keyof typeof form) {
    return {
      value: form[nombre],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [nombre]: e.target.value })),
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones y la política de privacidad para continuar.");
      return;
    }
    setError(null);
    setCargando(true);
    try {
      await registrar(form);
      navigate("/perfil?bienvenida=1");
    } catch {
      setError("No se pudo completar el registro. Revisa los datos e intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <AuthLayout titulo="Crea tu cuenta" subtitulo="Empieza a comprar y vender en minutos.">
      <form onSubmit={handleSubmit}>
        <Input etiqueta="Nombre completo" required {...campo("nombre_completo")} />
        <Input etiqueta="Email" type="email" required {...campo("email")} />
        <Input etiqueta="Contraseña" type="password" required minLength={8} {...campo("password")} />
        <Input etiqueta="Teléfono" {...campo("telefono")} />
        <Input etiqueta="Ubicación (municipio, departamento)" {...campo("ubicacion")} />

        <label className="mb-4 flex items-start gap-2.5 text-sm text-muted">
          <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
            className="mt-0.5 h-4 w-4 flex-none rounded border-line text-primary accent-primary"
          />
          <span>
            Acepto los{" "}
            <Link to="/terminos" target="_blank" className="font-medium text-ink underline underline-offset-2 hover:text-primary">
              términos y condiciones
            </Link>{" "}
            y la{" "}
            <Link to="/privacidad" target="_blank" className="font-medium text-ink underline underline-offset-2 hover:text-primary">
              política de privacidad
            </Link>
            .
          </span>
        </label>

        {error && <p className="mb-4 text-sm text-danger">{error}</p>}
        <Button type="submit" disabled={cargando} className="w-full">
          {cargando ? "Creando cuenta..." : "Registrarme"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="font-semibold text-primary">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
