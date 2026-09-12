import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Field";
import { Card } from "@/shared/ui/Card";

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
    <div className="mx-auto mt-16 max-w-md px-4">
      <Card>
        <h1 className="mb-1 font-display text-2xl font-semibold">Crea tu cuenta</h1>
        <p className="mb-6 text-sm text-muted">
          RNF01: menos de 10 minutos hasta publicar tu primer producto.
        </p>
        <form onSubmit={handleSubmit}>
          <Input etiqueta="Nombre completo" required {...campo("nombre_completo")} />
          <Input etiqueta="Email" type="email" required {...campo("email")} />
          <Input etiqueta="Contraseña" type="password" required minLength={8} {...campo("password")} />
          <Input etiqueta="Teléfono" {...campo("telefono")} />
          <Input etiqueta="Ubicación (municipio, departamento)" {...campo("ubicacion")} />
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
      </Card>
    </div>
  );
}
