# Problema Actual: Conexión a la Base de Datos en Vercel

## Descripción del Problema:
Al desplegar el portafolio en Vercel, la aplicación no logra conectarse a la base de datos PostgreSQL de Neon DB, resultando en errores al intentar cargar posts o proyectos.

## Mensajes de Error Observados:
1.  `Error al cargar los proyectos: connect ECONNREFUSED 127.0.0.1:5432`
2.  `Error al cargar las entradas del blog: getaddrinfo ENOTFOUND base`

## Pasos Intentados para Solucionar:

1.  **Diagnóstico Inicial:** El error `ECONNREFUSED 127.0.0.1:5432` indicó que la aplicación intentaba conectarse a una base de datos local (`localhost`) en lugar de la remota de Neon DB.
2.  **Verificación de `DATABASE_URL` en Vercel:** Se solicitó al usuario verificar que la variable de entorno `DATABASE_URL` estuviera configurada en Vercel con la cadena de conexión completa de Neon DB.
3.  **Error `getaddrinfo ENOTFOUND base`:** Tras la verificación, apareció un nuevo error (`getaddrinfo ENOTFOUND base`), sugiriendo que la cadena de conexión aún no era correcta o estaba siendo interpretada erróneamente.
4.  **Revisión de Comillas en `DATABASE_URL`:** Se indicó al usuario que las variables de entorno en Vercel no deben llevar comillas, a diferencia de cómo se definen en el archivo `.env` local. Se solicitó verificar y eliminar cualquier comilla alrededor del valor de `DATABASE_URL` en Vercel.

## Próximas Soluciones a Explorar (Esta Tarde):

1.  **Confirmación Visual de `DATABASE_URL` en Vercel:**
    *   Pedir al usuario que comparta una captura de pantalla (o describa exactamente) cómo está configurada la `DATABASE_URL` en la interfaz de Vercel para asegurar que no hay errores tipográficos o caracteres ocultos.
    *   Comparar la cadena de Vercel con la cadena de conexión directamente desde el panel de Neon DB para asegurar que son idénticas.

2.  **Verificación de la Cadena de Conexión en Neon DB:**
    *   Asegurarse de que la cadena de conexión obtenida de Neon DB es la correcta para la conexión directa desde una aplicación (a veces hay opciones para diferentes tipos de conexión).

3.  **Depuración en Código (si lo anterior no funciona):**
    *   Añadir `console.log(process.env.DATABASE_URL)` temporalmente en el código del servidor (en los endpoints de la API) para ver qué valor está recibiendo realmente la aplicación en Vercel. Esto nos ayudaría a confirmar si la variable de entorno se está cargando correctamente. (Esto requeriría un nuevo despliegue para ver los logs).

4.  **Revisar el uso de la conexión en `src/lib/db.ts`:**
    *   Asegurarse de que `import.meta.env.DATABASE_URL` es la forma correcta de acceder a las variables de entorno en el contexto de Astro en Vercel. (Aunque esto ya ha funcionado en desarrollo, es bueno confirmarlo).

5.  **Posible problema de Firewall/Acceso:**
    *   Aunque menos probable con Neon DB, verificar si hay alguna restricción de IP o firewall en Neon DB que impida la conexión desde los servidores de Vercel.
