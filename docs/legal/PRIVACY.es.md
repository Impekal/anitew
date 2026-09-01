# Política de privacidad

**Versión de: 2026-08-29**

<!-- verbindlich: de -->
> **La versión alemana es la vinculante.** Esta traducción se ofrece por comodidad. En caso de discrepancia, prevalece el texto alemán en [/datenschutz.html](/datenschutz.html).

> Primero lo esencial: **ANITEW sigue siendo local-first.** No hay **ninguna
> cuenta de ANITEW**, ni publicidad, ni servicios de análisis externos, ni
> rastreadores. El entrenamiento, los recuerdos, las mediciones y el perfil se
> quedan en tu dispositivo. Solo las funciones que activas o desencadenas
> expresamente —sincronización con Google Drive, funciones de IA, análisis de
> fotos y notificaciones del sistema— usan los servicios de red necesarios.

Este documento describe lo que la versión actual de ANITEW hace realmente.

---

## 1. Responsable de la protección de datos

Responsable en el sentido del Reglamento General de Protección de Datos (RGPD):

**ANITEW by Impekal**  
Titular: **Dr. Mèhèza Kalibani**  
Holstenwall 24  
20335 Hamburgo  
Alemania

Correo electrónico: impekaltech+anitew@gmail.com  
Teléfono: +49 151 12784951

Más datos del prestador figuran en el [aviso legal](/impressum.es.html).

## 2. Qué se guarda en tu dispositivo

En el almacenamiento del navegador (sobre todo IndexedDB; junto a él localStorage/sessionStorage para preferencias del dispositivo como el tema, marcas de primer inicio y avisos pasajeros) se encuentran, entre otras cosas:

| Qué | Para qué |
|---|---|
| Sesiones de entrenamiento y respuestas | Plan de repetición y evaluaciones |
| Fechas de repetición | Reencuentros pendientes |
| Mediciones | Comparación dentro de tu propia serie de mediciones |
| Tus propios recuerdos, tarjetas y palacio de la memoria | Entrenamiento personal |
| Ajustes como idioma, sonido y hora de recordatorio | Próximo inicio |

Estos contenidos **no** se copian a un servidor de ANITEW para el Web Push.

ANITEW puede además calcular en el dispositivo información de diagnóstico
puramente técnica y mediciones beta agregadas. No contienen textos de recuerdos,
contenidos de respuestas, claves de API ni tokens de OAuth y **no se transmiten
automáticamente**. Una persona debe exportar expresamente ese informe antes de
poder entregarlo voluntariamente.

## 3. Lo que ANITEW no hace

- Sin publicidad, sin identificador publicitario, sin perfilado publicitario.
- Sin servicios de análisis externos, sin estadísticas de uso automáticas, sin rastreadores.
- Sin subida de tus contenidos de entrenamiento o de memoria para el push.
- Sin acceso a los contactos ni a la ubicación.
- Sin grabación permanente del micrófono o la cámara en segundo plano.
- Sin clasificación pública ni perfiles sociales.

## 4. Micrófono, dictado y fotos

### Dictado

Si inicias expresamente la función de dictado, ANITEW puede usar el micrófono
para **un dictado breve**. El reconocimiento de voz solo se inicia si el
navegador confirma un reconocimiento local y admite `processLocally`. ANITEW
deliberadamente **no** recurre a un servicio de voz remoto del navegador. Si el
procesamiento local no está disponible, el dictado permanece apagado. El texto
reconocido se trata como texto escrito por ti.

### Selección de foto y cámara

«Elegir foto» abre el selector de imágenes/cámara que proporciona el
dispositivo. La foto original elegida permanece primero como copia de trabajo
local y pasajera en la memoria del navegador y no se guarda automáticamente en
IndexedDB, en la copia de seguridad ni en Google Drive.

Solo cuando además tocas **«Analizar foto»**, ANITEW crea en el navegador una
copia JPEG reducida sin metadatos de archivo/EXIF y la envía directamente al
proveedor de IA que hayas elegido y configurado con tu propia clave de API. La
foto original no se envía al proveedor. La respuesta de la IA es solo una
propuesta; no se guarda nada hasta tu confirmación expresa.

## 5. Qué ocurre técnicamente al cargar

La aplicación se distribuye mediante Cloudflare Workers/Static Assets. Como con
cualquier servidor web, en el proveedor de infraestructura se generan datos
técnicos de conexión como la dirección IP, el momento, el navegador y la
petición de archivo. ANITEW no construye con ello ningún perfil de uso.

**En claro:** una vez cargada, **el entrenamiento en sí funciona sin conexión**.
Solo se necesita acceso a la red para las funciones en línea elegidas
expresamente. La sincronización con Drive, las funciones de IA y las
notificaciones del sistema están apagadas hasta que las toques. Solo una
activación o acción expresa inicia el camino en línea correspondiente.

## 6. Copia de seguridad y restauración

«Guardar copia de seguridad» crea un archivo JSON con tu estado de ANITEW. Tú
decides dónde queda. Quien posea ese archivo puede leer su contenido.

**No se incluyen en la copia** los valores ligados al dispositivo: claves de API
de IA guardadas, la indicación de la cuenta de Google del dispositivo y el estado
técnico de la sincronización con Drive. No salen del dispositivo ni en el archivo
ni durante la sincronización con Drive; incluso al leer un archivo antiguo que
todavía contenga tales valores, se descartan.

En la sincronización opcional con Google Drive, ANITEW deposita ese mismo archivo
de copia en una carpeta propia `Anitew` de tu Google Drive. ANITEW no toca otros
archivos.

## 7. Notificaciones del sistema / Web Push

Si tocas expresamente «Permitir notificaciones» y tu dispositivo admite Web
Push, el navegador crea una **dirección push técnica** para ese dispositivo.
Para la entrega, ANITEW guarda en el servidor únicamente:

- esa dirección push técnica,
- el identificador del recordatorio (`daily` o `benchmark`),
- el momento de vencimiento,
- en el recordatorio diario, la hora y la zona horaria IANA,
- el texto genérico de notificación —también como una nota breve de entrega que
  queda disponible en el servidor tras el disparo hasta que tu dispositivo la
  recoge, pero como máximo 24 horas **desde el momento de vencimiento** (60
  minutos en el recordatorio de medición); después se borra en lugar de
  entregarse con retraso. El plazo cuenta desde el vencimiento y no vuelve a
  empezar con un nuevo intento de entrega. Este plazo se aplica con
  independencia de que haya más recordatorios previstos o de que el servicio
  push esté inaccesible en ese momento. Si no queda ni una cita ni una nota, se
  borra por completo la entrada del lado del servidor.

**Para ello no se guardan:** respuestas de entrenamiento, contenidos de memoria,
perfil, nombre, dirección de correo, mediciones ni archivos de copia.

El almacenamiento se realiza en un Durable Object de Cloudflare derivado
únicamente de la dirección push. Para ello no existe ninguna cuenta de usuario de
ANITEW ni un identificador de usuario multiplataforma. El camino de entrega
propiamente dicho pasa por el servicio push que determina el navegador o el
sistema operativo (en dispositivos Apple, la infraestructura correspondiente de
Apple).

«Sin recordatorio» borra el recordatorio diario. «Empezar de cero» intenta borrar
la entrada push del lado del servidor y además revoca la suscripción push local;
con ello la dirección push anterior queda inválida, aunque el servidor no sea
accesible en ese momento. El permiso de notificación puede retirarse además en
cualquier momento en los ajustes del sistema o del navegador.

En iPhone y iPad, el Web Push solo funciona para una aplicación web añadida a la
pantalla de inicio en versiones compatibles de iOS/iPadOS. Donde el Web Push no
esté disponible en un dispositivo, ANITEW no promete ninguna notificación del
sistema con la app cerrada y recurre al aviso «solo mientras esté abierta».

## 8. Borrado y portabilidad

- **Portabilidad:** «Guardar copia de seguridad» exporta tu estado local.
- **Reinicio completo:** «Empezar de cero» borra los datos locales de ANITEW,
  apaga localmente la sincronización con Google y revoca la suscripción push.
  Opcionalmente puede borrarse también el archivo de copia propio de ANITEW en
  tu Google Drive. Si el worker de OAuth no es accesible en el momento del
  reinicio, el cierre de sesión técnico del navegador se recupera en el siguiente
  inicio accesible; entretanto no puede iniciarse ninguna sincronización con
  Drive, porque su interruptor local ya está borrado.
- **Solo apagar el recordatorio:** «Sin recordatorio» finaliza el recordatorio
  diario sin borrar tus datos de entrenamiento.

## 9. Sincronización con Google Drive

Google Drive está apagado hasta que lo enciendas tú. El inicio de sesión se
realiza mediante Google OAuth. Junto al acceso a Drive, ANITEW solicita la
información básica de Google (`openid email profile`) —únicamente para que la
interfaz pueda mostrar con qué cuenta estás conectado—. El worker de Cloudflare
intercambia el código de autorización de Google por tokens y mantiene la sesión
—incluido el token de actualización de Google— cifrada en una cookie `HttpOnly`
de tu navegador. La duración está fijada en un máximo de 180 días desde el inicio
de sesión; el plazo **no** se prolonga con el uso.

Al tocar «Desconectar la cuenta de Google», la sincronización con Drive se apaga
**de inmediato y de forma permanente** en el dispositivo y se retira la identidad
de cuenta mostrada localmente. Si el worker es accesible, borra al mismo tiempo
la cookie de sesión HttpOnly e intenta revocar el token de Google. Si el worker
no es accesible temporalmente —por ejemplo, porque el dispositivo está sin
conexión—, el navegador no puede borrar técnicamente por sí mismo la cookie
HttpOnly. ANITEW entonces solo anota localmente ese cierre de sesión técnico
pendiente y lo vuelve a intentar en el siguiente inicio o al recuperar la
conexión. Entretanto, la sincronización con Drive permanece apagada; la cookie
que quedó no la activa por sí sola. Con independencia de ello, la sesión sellada
termina a más tardar con su plazo fijo de 180 días.

**Regla transitoria para inicios de sesión antiguos:** las sesiones creadas
antes de la introducción de este plazo fijo no llevan en sí ningún momento de
inicio de sesión; no puede determinarse a posteriori y tampoco se estima. Por eso
tales sesiones caducan a más tardar **30 días** después del primer uso con la
nueva versión —menos que cualquier tiempo restante que hubieran tenido antes—.
Después es necesario un nuevo inicio de sesión; para este rige entonces el plazo
fijo de 180 días desde el inicio de sesión. No existe ninguna base de datos de
usuarios de ANITEW en la que se guarden tokens. El dispositivo utiliza después el
acceso para la carpeta ANITEW en tu propio Drive. El nombre y el correo que se
muestran en la interfaz para el control de la cuenta se mantienen localmente en
el almacenamiento del dispositivo de ANITEW y se retiran al desconectar.

Para Google se aplican además sus propias condiciones de privacidad.

## 10. Funciones de IA con tu propia clave de API

El coach y las propuestas de IA están apagados hasta que guardes tu propia clave
y desencadenes expresamente una función correspondiente. En el coach de texto se
admiten, según tu selección, Gemini, Anthropic, OpenAI, Groq, OpenRouter o
Mistral. Entonces la pregunta y el contexto numérico descrito para ella van
directamente al proveedor de IA elegido. Tus propios textos de recuerdos solo se
transmiten en una función de propuesta de IA que tú desencadenes.

Para el análisis de fotos solo se admiten Gemini, Anthropic u OpenAI. Como se
describe en la sección 4, solo se transmite una copia de imagen preparada después
de «Analizar foto».

La clave de API permanece en tu dispositivo. Para el tratamiento en el proveedor
correspondiente rige además su política de privacidad.

## 11. Bases jurídicas y plazos de conservación

En la medida en que ANITEW trate datos únicamente en tu dispositivo, eres tú
quien decide sobre su existencia mediante el uso, la exportación y el borrado. En
las funciones en línea activadas voluntariamente, el tratamiento sirve para
prestar la función expresamente elegida en cada caso. Plazos concretos: la cookie
de sesión de Google cifrada caduca a más tardar 180 días después del inicio de
sesión y no se prolonga con el uso. Al cerrar sesión, la sincronización local con
Drive finaliza de inmediato; el worker borra la cookie en el cierre de sesión
confirmado. Si el worker no puede alcanzarse en ese momento, se reintenta
exactamente ese cierre de sesión técnico en el siguiente inicio con conexión. Las
sesiones anteriores a la regla de los 180 días caducan, según la regla
transitoria de la sección 9, a más tardar 30 días después del primer uso con la
nueva versión. Las entradas push del lado del servidor existen hasta que la cita
se haya entregado y recogido, hasta que finalices el recordatorio o hasta que
termine la suscripción push —las notas de entrega no recogidas, como máximo 24
horas (recordatorio de medición: 60 minutos)—. Los registros técnicos de
infraestructura y los datos en proveedores externos están sujetos además a sus
reglas de conservación legales y contractuales.

## 12. Tus derechos

En la medida en que el responsable trate datos personales, tienes, en el alcance
previsto por la ley, en particular derechos de acceso, rectificación, supresión,
limitación del tratamiento, portabilidad y oposición. Existe además el derecho a
presentar una reclamación ante una autoridad de control de protección de datos
competente. Para cualquier consulta basta la dirección de correo indicada arriba.

## 13. Menores

ANITEW no tiene función de chat entre usuarios, ni clasificación pública, ni
publicidad. Las funciones en línea voluntarias descritas arriba siguen las mismas
reglas técnicas con independencia de la edad.

## 14. Cambios

Si cambia el tratamiento, esta declaración se adapta con una fecha nueva. Una
función que transmita datos adicionales no puede aparecer en silencio bajo un
texto de privacidad antiguo.
