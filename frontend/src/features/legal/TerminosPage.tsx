import { LegalLayout, Seccion } from "./LegalLayout";

export function TerminosPage() {
  return (
    <LegalLayout titulo="Términos y condiciones" actualizado="12 de septiembre de 2026">
      <Seccion titulo="1. Qué es AgroMarket">
        <p>
          AgroMarket es un marketplace donde productores, proveedores y compradores del sector
          agropecuario publican y encuentran insumos veterinarios, alimento balanceado y animales o
          material genético. Este sitio es un proyecto académico (Politécnico Grancolombiano) que
          funciona como un producto real para efectos de evaluación; al usarlo aceptas estos
          términos.
        </p>
      </Seccion>

      <Seccion titulo="2. Quién puede usar la plataforma">
        <p>
          Debes tener al menos 18 años y registrar una cuenta con datos verídicos. Para publicar un
          producto o contactar a un vendedor necesitas completar el proceso de verificación de
          identidad: subir un documento válido y esperar la aprobación de un administrador. Una
          cuenta con datos falsos o un documento adulterado puede suspenderse sin previo aviso.
        </p>
      </Seccion>

      <Seccion titulo="3. Tus publicaciones">
        <p>
          Al publicar te haces responsable de que la información sea veraz: precio, cantidad,
          ubicación y, en el caso de animales, su estado de salud. Cada publicación pasa por revisión
          de un administrador antes de quedar visible en el catálogo, y puede ser rechazada o
          suspendida después si incumple estas condiciones o recibe un reporte fundado.
        </p>
      </Seccion>

      <Seccion titulo="4. Mensajería entre usuarios">
        <p>
          El chat integrado es para coordinar la compra: resolver dudas sobre el producto, acordar
          precio, forma de entrega y pago. No uses la mensajería para spam, acoso o para compartir
          contenido ajeno al propósito de la conversación.
        </p>
      </Seccion>

      <Seccion titulo="5. Las transacciones son entre comprador y vendedor">
        <p>
          AgroMarket no interviene en el pago ni en la entrega del producto: no somos pasarela de
          pago, no custodiamos dinero y no garantizamos el resultado de una negociación. El
          comprador y el vendedor acuerdan directamente cómo pagar y entregar, y son los únicos
          responsables de cumplir lo pactado. Registrar una transacción como completada en la
          plataforma sirve para habilitar la calificación, no es una confirmación de que el pago se
          haya realizado.
        </p>
      </Seccion>

      <Seccion titulo="6. Calificaciones">
        <p>
          Después de una transacción marcada como completada, el comprador puede calificar al
          vendedor. Las calificaciones deben reflejar una experiencia real; manipularlas (calificarte
          a ti mismo con otra cuenta, coordinar reseñas falsas) es motivo de suspensión.
        </p>
      </Seccion>

      <Seccion titulo="7. Reportes y conducta prohibida">
        <p>
          Cualquier usuario puede reportar una publicación o un perfil que parezca fraudulento,
          engañoso o que incumpla estos términos. No está permitido: suplantar a otra persona o
          empresa, publicar productos que no tienes o no vendes, ni usar la plataforma para
          actividades ilegales. Un administrador revisa cada reporte y decide si corresponde
          rechazar una publicación, suspenderla o restringir la cuenta.
        </p>
      </Seccion>

      <Seccion titulo="8. Suspensión de cuentas">
        <p>
          Podemos suspender o cerrar una cuenta que incumpla estos términos, tenga un documento de
          identidad rechazado repetidamente, o acumule reportes fundados. Te avisaremos por
          notificación cuando esto afecte a tu cuenta o a una publicación tuya.
        </p>
      </Seccion>

      <Seccion titulo="9. Cambios a estos términos">
        <p>
          Podemos actualizar estos términos a medida que la plataforma evoluciona. Si el cambio es
          significativo lo indicaremos en esta misma página junto con la fecha de actualización.
        </p>
      </Seccion>

      <Seccion titulo="10. Contacto">
        <p>
          Preguntas sobre estos términos: <strong>soporte@agromarket.co</strong>.
        </p>
      </Seccion>
    </LegalLayout>
  );
}
