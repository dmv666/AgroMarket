export function tiempoRelativo(fechaISO: string): string {
  const segundos = Math.round((Date.now() - new Date(fechaISO).getTime()) / 1000);
  if (segundos < 60) return "ahora";
  const minutos = Math.round(segundos / 60);
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.round(horas / 24);
  if (dias === 1) return "ayer";
  if (dias < 7) return `hace ${dias} días`;
  return new Date(fechaISO).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}
