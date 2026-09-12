import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Field";
import { Card } from "@/shared/ui/Card";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Email o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md px-4">
      <Card>
        <h1 className="mb-1 font-display text-2xl font-semibold">Inicia sesión</h1>
        <p className="mb-6 text-sm text-muted">Accede a tu cuenta de Campo Directo.</p>
        <form onSubmit={handleSubmit}>
          <Input
            etiqueta="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            etiqueta="Contraseña"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="mb-4 text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={cargando} className="w-full">
            {cargando ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-semibold text-primary">
            Regístrate
          </Link>
        </p>
      </Card>
    </div>
  );
}
