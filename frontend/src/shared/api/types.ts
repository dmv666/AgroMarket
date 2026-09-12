// Tipos espejo de los serializers del backend (apps/*/serializers.py).
// Mantenerlos en un solo archivo compartido evita que cada feature invente
// su propia forma de los mismos datos (DRY entre features).

export type EstadoVerificacion = "pendiente" | "aprobado" | "rechazado";

export interface UsuarioPublico {
  id: number;
  nombre_completo: string;
  ubicacion: string;
  estado_verificacion: EstadoVerificacion;
  promedio_calificacion: string | null;
  total_calificaciones: number;
  creado_en: string;
}

export interface Usuario extends UsuarioPublico {
  email: string;
  telefono: string;
  tipo_documento: string;
  numero_documento: string | null;
  documento_identidad_archivo: string | null;
  fecha_solicitud_verificacion: string | null;
  es_administrador: boolean;
}

export type Categoria = "insumo_veterinario" | "alimento_balanceado" | "animal_genetica";
export type EstadoPublicacion = "pendiente" | "aprobada" | "rechazada" | "suspendida";
export type TipoGenetica = "cria" | "reproductor" | "semen";

export interface DetalleInsumoVeterinario {
  tipo_insumo: string;
  fabricante: string;
  fecha_vencimiento: string | null;
}

export interface DetalleAlimentoBalanceado {
  tipo_alimento: string;
  presentacion: string;
  peso_kg: string;
}

export interface DetalleAnimalGenetica {
  especie: string;
  raza: string;
  edad: string;
  estado_salud: string;
  certificados_sanitarios: string | null;
  tipo_genetica: TipoGenetica;
}

export type Detalle = DetalleInsumoVeterinario | DetalleAlimentoBalanceado | DetalleAnimalGenetica;

export interface ImagenPublicacion {
  id: number;
  archivo: string;
  orden: number;
}

export interface Publicacion {
  id: number;
  vendedor: UsuarioPublico;
  categoria: Categoria;
  titulo: string;
  descripcion: string;
  precio: string;
  cantidad_disponible: number;
  ubicacion: string;
  estado: EstadoPublicacion;
  motivo_moderacion: string;
  imagenes: ImagenPublicacion[];
  detalle: Detalle | null;
  creado_en: string;
}

export interface Mensaje {
  id: number;
  conversacion: number;
  remitente: UsuarioPublico;
  contenido: string;
  leido: boolean;
  creado_en: string;
}

export interface Conversacion {
  id: number;
  publicacion: number;
  comprador: UsuarioPublico;
  vendedor: UsuarioPublico;
  ultimo_mensaje: Mensaje | null;
  creado_en: string;
}

export type EstadoTransaccion = "pendiente" | "completada";

export interface Transaccion {
  id: number;
  publicacion: number;
  comprador: UsuarioPublico;
  vendedor: UsuarioPublico;
  estado: EstadoTransaccion;
  creado_en: string;
}

export interface Calificacion {
  id: number;
  transaccion: number;
  comprador: UsuarioPublico;
  puntuacion: number;
  comentario: string;
  creado_en: string;
}

export type TipoNotificacion =
  | "mensaje"
  | "publicacion_aprobada"
  | "publicacion_rechazada"
  | "publicacion_reportada"
  | "calificacion_recibida"
  | "verificacion_aprobada"
  | "verificacion_rechazada";

export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  contenido: string;
  leida: boolean;
  creado_en: string;
}

export type EstadoReporte = "sin_revisar" | "en_revision" | "resuelto";

export interface Reporte {
  id: number;
  usuario_reporta: number;
  usuario_reporta_nombre: string;
  publicacion_reportada: number | null;
  publicacion_reportada_titulo: string | null;
  usuario_reportado: number | null;
  usuario_reportado_nombre: string | null;
  motivo: string;
  descripcion: string;
  estado: EstadoReporte;
  revisado_por: number | null;
  fecha_revision: string | null;
  creado_en: string;
}

export interface Paginado<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
