import { LegalLayout, Seccion } from "./LegalLayout";

export function PrivacidadPage() {
  return (
    <LegalLayout titulo="Política de privacidad" actualizado="12 de septiembre de 2026">
      <Seccion titulo="1. Qué datos recopilamos">
        <p>
          Al registrarte: nombre, email, teléfono y ubicación. Al verificar tu identidad: tipo y
          número de documento, y la foto o escaneo que subas. Al usar la plataforma: las
          publicaciones que creas, los mensajes que envías a otros usuarios y las transacciones y
          calificaciones en las que participas.
        </p>
      </Seccion>

      <Seccion titulo="2. Para qué los usamos">
        <ul className="list-disc space-y-1 pl-5">
          <li>Confirmar que eres una persona real antes de dejarte publicar o contactar vendedores.</li>
          <li>Mostrar tu publicación en el catálogo y ponerte en contacto con interesados.</li>
          <li>Calcular tu reputación (promedio de calificaciones) a partir de tus transacciones.</li>
          <li>Revisar reportes y hacer cumplir los términos de uso.</li>
          <li>Enviarte notificaciones sobre mensajes, el estado de tus publicaciones y tu verificación.</li>
        </ul>
      </Seccion>

      <Seccion titulo="3. Quién puede ver tus datos">
        <p>
          Tu nombre, ubicación y reputación son visibles públicamente en tu perfil de vendedor. Tu
          email, teléfono, número de documento y el archivo de verificación nunca se muestran a
          otros usuarios: solo los ve un administrador, y únicamente para decidir si aprueba tu
          verificación. No vendemos ni compartimos tus datos con terceros ajenos a la plataforma.
        </p>
      </Seccion>

      <Seccion titulo="4. Dónde se almacenan">
        <p>
          Los datos viven en la base de datos y el almacenamiento de archivos del proyecto; no se
          replican a servicios externos de terceros. El documento de identidad se guarda como
          cualquier otro archivo subido a la plataforma, con acceso restringido a administradores.
        </p>
      </Seccion>

      <Seccion titulo="5. Cuánto tiempo los conservamos">
        <p>
          Mientras tu cuenta esté activa. Si la eliminas, puedes solicitarnos borrar tus datos
          personales; conservamos únicamente lo necesario para mantener la integridad del historial
          de transacciones de otros usuarios (por ejemplo, que una calificación quede huérfana no
          debería alterar la reputación de la otra parte).
        </p>
      </Seccion>

      <Seccion titulo="6. Tus derechos">
        <p>
          Conforme a la Ley 1581 de 2012 (protección de datos personales, Colombia) puedes acceder,
          corregir o solicitar la eliminación de tus datos, y revocar tu autorización en cualquier
          momento. Desde tu perfil puedes editar tus datos de contacto directamente; para cualquier
          otra solicitud escríbenos a <strong>soporte@agromarket.co</strong>.
        </p>
      </Seccion>

      <Seccion titulo="7. Cookies y almacenamiento local">
        <p>
          AgroMarket no usa cookies de rastreo, analítica de terceros ni publicidad. Guardamos en
          el almacenamiento local de tu navegador (no en una cookie tradicional) tres cosas: el
          token que mantiene tu sesión iniciada, tu preferencia de modo claro/oscuro, y si ya viste
          este aviso. Nada de eso sale de tu navegador ni se comparte con terceros.
        </p>
      </Seccion>

      <Seccion titulo="8. Menores de edad">
        <p>AgroMarket no está dirigido a menores de 18 años y no recopila deliberadamente sus datos.</p>
      </Seccion>

      <Seccion titulo="9. Cambios a esta política">
        <p>
          Si actualizamos esta política, cambiaremos la fecha al inicio de esta página. Te
          recomendamos revisarla de vez en cuando.
        </p>
      </Seccion>

      <Seccion titulo="10. Contacto">
        <p>
          Preguntas sobre tus datos: <strong>soporte@agromarket.co</strong>.
        </p>
      </Seccion>
    </LegalLayout>
  );
}
