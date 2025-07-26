# Plan de Proyecto: Portafolio con Astro, PostgreSQL y Vercel

Este documento describe los pasos necesarios para construir, gestionar y desplegar un portafolio web completo desde cero.

---

### **Fase 1: Configuración Inicial y Entorno de Desarrollo**

El objetivo de esta fase es tener un proyecto Astro funcional conectado a un repositorio Git y listo para el desarrollo local.

1.  **Navegar al Directorio del Proyecto:**
    ```bash
    cd portafolio2.0
    ```

2.  **Inicializar Repositorio Git:**
    ```bash
    git init
    ```

3.  **Crear Proyecto Astro:**
    *   Ejecuta el comando para crear un nuevo proyecto Astro.
    ```bash
    npm create astro@latest .
    ```
    *   Sigue las instrucciones: elige la plantilla "Empty" (Vacío), selecciona "TypeScript" (Strict) y acepta instalar las dependencias (`npm install`).

4.  **Instalar Dependencias de Base de Datos:**
    *   Necesitamos el driver de PostgreSQL para Node.js.
    ```bash
    npm install pg
    ```

5.  **Configurar Variables de Entorno Locales:**
    *   Crea un archivo en la raíz del proyecto llamado `.env`.
    *   Añade tu cadena de conexión a la base de datos. Este archivo **no se subirá** a Git.
    ```
    # .env
    DATABASE_URL="postgresql://neondb_owner:npg_2MGHEULOJt0g@ep-silent-cloud-ab3kdk6l-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"
    ```

6.  **Configurar `.gitignore`:**
    *   Astro ya crea un `.gitignore` básico. Asegúrate de que contenga al menos las siguientes líneas para evitar subir archivos sensibles o innecesarios.
    ```
    # .gitignore
    node_modules/
    dist/
    .env
    .DS_Store
    ```

7.  **Primer Commit:**
    *   Guarda el estado inicial del proyecto.
    ```bash
    git add .
    git commit -m "Initial project setup with Astro and dependencies"
    ```
    *   **Subir a GitHub:**
        ```bash
        git remote add origin https://github.com/Celot1979/portafolio2.0.git
        git branch -M main
        git pull --rebase origin main # Para integrar cambios remotos si existen
        git push -u origin main
        ```

**Estado: Completada.**

---

### **Fase 2: Conexión a la Base de Datos y Obtención de Datos**

Ahora nos aseguraremos de que Astro puede leer los datos de tu base de datos PostgreSQL.

1.  **Crear Módulo de Conexión:**
    *   Crea el archivo `src/lib/db.ts`.
    *   Este archivo gestionará la conexión a la base de datos.
    ```typescript
    // src/lib/db.ts
    import pg from 'pg';

    const { Pool } = pg;

    const connectionString = import.meta.env.DATABASE_URL; // Corregido para Astro

    export const db = new Pool({
      connectionString,
    });
    ```

2.  **Probar la Conexión:**
    *   Modifica la página de inicio `src/pages/index.astro` para obtener y mostrar datos de la tabla `blog_posts`.
    *   Ejecuta `npm run dev` y visita `http://localhost:4321`. Deberías ver los datos de tu tabla `blog_posts`.

**Estado: Completada.**

---

### **Fase 3: Creación de las Páginas Públicas (Frontend)**

Con los datos fluyendo, construiremos las páginas que verán los visitantes.

1.  **Crear Componente de Cabecera (`Header.astro`) y Actualizar Layout (`Layout.astro`):**
    *   Crea `src/components/Header.astro` con la navegación principal.
    *   Actualiza `src/layouts/Layout.astro` para incluir `Header`, un pie de página básico y estilos globales de fondo negro y texto blanco.
    *   Cambia el nombre en el pie de página a "Daniel G.M.".

2.  **Página de Listado del Blog:**
    *   Crea `src/pages/blog/index.astro`.
    *   Obtén todos los posts y crea una lista de enlaces.
    *   Muestra la imagen (`image_url`) de cada post en el listado.
    *   Añade un botón "Leer más" que enlace a la página de detalle del post.

3.  **Página de Detalle de un Post (Ruta Dinámica):**
    *   Renombra `src/pages/blog/[slug].astro` a `src/pages/blog/[id].astro`.
    *   Usa `getStaticPaths` para generar una página por cada post usando el `id`.
    *   Muestra la imagen (`image_url`) del post en la página de detalle.
    *   Instala `marked` (`npm install marked`) y úsalo para convertir el contenido Markdown (`post.content`) a HTML.

4.  **Páginas de Proyectos:**
    *   Crea `src/pages/proyectos/index.astro` y `src/pages/proyectos/[slug].astro`.
    *   Muestra la imagen (`image_url`) de cada proyecto en el listado y en la página de detalle.

5.  **Páginas Estáticas:**
    *   Desarrolla el contenido de `src/pages/acerca-de-mi.astro` (con texto e imagen proporcionados).
    *   Desarrolla el contenido de `src/pages/contacto.astro` (con botones "Enviar Email" y "Enviar Telegram" y tu email).

6.  **Mejoras Visuales y Animaciones:**
    *   **Página de Inicio (`index.astro`):** Centra el texto y aumenta su tamaño.
    *   **Animación "Fade-In on Scroll":**
        *   Crea el componente `src/components/FadeInOnScroll.astro`.
        *   Envuelve el contenido principal de `index.astro` con `FadeInOnScroll`.
        *   Envuelve cada `article` en `blog/index.astro` y `proyectos/index.astro` con `FadeInOnScroll` (con retraso escalonado).
        *   **Nota:** Se desactivó temporalmente para depuración.
    *   **Animación de Fondo Sutil:** Implementa un gradiente animado en el `body` a través de `src/layouts/Layout.astro`.
    *   **Efecto de Rastro de Ratón:** Se intentó implementar pero se revirtió debido a problemas de estabilidad.

**Estado: En progreso.**

---

### **Fase 4: Creación del Sistema de Gestión (Backend)**

**Objetivo Principal:** Permitir la creación y gestión de nuevo contenido (entradas de blog y proyectos) a través de una interfaz web segura, y automatizar la actualización del portafolio una vez que se añade nuevo contenido.

Esta fase se centrará en la creación de una sección de administración básica pero funcional, accesible solo para ti.

---

#### **Componentes Clave de esta Fase:**

1.  **Autenticación (Login/Logout):** Un sistema simple para proteger la sección de administración.
2.  **Panel de Administración (Dashboard):** Una página central para navegar por las opciones de gestión de contenido.
3.  **Formularios de Creación de Contenido:** Interfaces para añadir nuevas entradas de blog y nuevos proyectos.
4.  **API Endpoints (Serverless Functions):** Funciones que recibirán los datos de los formularios y los guardarán en la base de datos.
5.  **Integración con Vercel Deploy Hook:** Para que el sitio se reconstruya automáticamente al añadir nuevo contenido.

---

#### **Plan de Implementación Detallado (Paso a Paso):**

**Paso 1: Configuración de la Autenticación Básica**

*   **Propósito:** Asegurar que solo tú puedas acceder a la sección de administración. Utilizaremos un sistema de usuario/contraseña simple almacenado en variables de entorno para mayor seguridad y facilidad de uso en un portafolio personal.
*   **Archivos a Crear/Modificar:**
    *   `portafolio2.0/.env`: Añadiremos `ADMIN_USERNAME` y `ADMIN_PASSWORD`.
    *   `portafolio2.0/src/lib/auth.ts`:
        *   Contendrá funciones para verificar credenciales.
        *   Funciones para manejar cookies de sesión (establecer y eliminar). Usaremos `js-cookie` para simplificar la gestión de cookies en el frontend.
    *   `portafolio2.0/src/pages/admin/login.astro`:
        *   Página con un formulario de inicio de sesión (usuario y contraseña).
        *   El formulario enviará los datos a un API endpoint.
    *   `portafolio2.2/src/pages/api/login.ts`:
        *   **Serverless Function** que recibirá las credenciales del formulario.
        *   Verificará las credenciales contra las variables de entorno.
        *   Si son correctas, establecerá una cookie de sesión segura en el navegador del usuario.
        *   Redirigirá al usuario al panel de administración.
    *   `portafolio2.0/src/pages/api/logout.ts`:
        *   **Serverless Function** que eliminará la cookie de sesión.
        *   Redirigirá al usuario a la página de inicio de sesión.
*   **Protección de Rutas:** En cada página de administración (`/admin/*`), en el frontmatter de Astro, verificaremos la existencia y validez de la cookie de sesión. Si no es válida, redirigiremos al usuario a la página de login.

**Paso 2: Creación del Panel de Administración (Dashboard)**

*   **Propósito:** Servir como la página principal de la sección de administración, con enlaces a las funcionalidades de creación de contenido.
*   **Archivo a Crear:**
    *   `portafolio2.0/src/pages/admin/index.astro`:
        *   Contendrá el chequeo de autenticación.
        *   Mostrará enlaces a "Crear Nueva Entrada de Blog" y "Crear Nuevo Proyecto".
        *   Tendrá un botón para "Cerrar Sesión".

**Paso 3: Creación de Formularios para Nuevo Contenido**

*   **Propósito:** Proporcionar interfaces amigables para que puedas introducir los datos de tus nuevas entradas de blog y proyectos.
*   **Archivos a Crear:**
    *   `portafolio2.0/src/pages/admin/nuevo-post.astro`:
        *   Formulario con campos para: `title`, `content` (textarea, posiblemente con soporte Markdown), `image_url`, `seo_description`.
        *   El formulario enviará los datos a `src/pages/api/posts/create.ts`.
    *   `portafolio2.0/src/pages/admin/nuevo-repo.astro`:
        *   Formulario con campos para: `name`, `description`, `technologies`, `url`, `github_url`, `image_url`.
        *   El formulario enviará los datos a `src/pages/api/repos/create.ts`.
*   **Consideraciones:**
    *   Ambos formularios tendrán un `<script>` en el cliente para manejar el envío del formulario (usando `fetch`) y mostrar mensajes de éxito/error.

**Paso 4: Implementación de API Endpoints (Serverless Functions) para Guardar Contenido**

*   **Propósito:** Recibir los datos de los formularios, validarlos y persistirlos en la base de datos PostgreSQL.
*   **Archivos a Crear:**
    *   `portafolio2.0/src/pages/api/posts/create.ts`:
        *   Recibirá el `FormData` del formulario.
        *   Realizará una validación básica de los datos (ej. campos obligatorios).
        *   Insertará los datos en la tabla `blog_posts` de PostgreSQL.
        *   **¡CRUCIAL!** Después de una inserción exitosa, activará el Vercel Deploy Hook (ver Paso 5).
        *   Devolverá una respuesta JSON indicando éxito o error.
    *   `portafolio2.0/src/pages/api/repos/create.ts`:
        *   Similar a `create.ts` para posts, pero insertará en la tabla `repositories`.
        *   También activará el Vercel Deploy Hook.

**Paso 5: Integración con Vercel Deploy Hook para Reconstrucción Automática**

*   **Propósito:** Asegurar que cada vez que añadas o modifiques contenido, tu sitio estático se reconstruya y se despliegue automáticamente con los nuevos datos.
*   **Configuración en Vercel (Manual):**
    *   Necesitarás ir al panel de control de Vercel para tu proyecto.
    *   En la sección "Settings" -> "Git" -> "Deploy Hooks", crearás un nuevo "Deploy Hook".
    *   Le darás un nombre (ej. `rebuild-on-content-change`) y seleccionarás la rama `main`.
    *   Vercel te proporcionará una URL única para este hook.
    *   Esta URL la guardarás como una variable de entorno secreta en Vercel, por ejemplo, `VERCEL_DEPLOY_HOOK_URL`.
*   **Activación desde API Endpoints (Código):**
    *   En `src/pages/api/posts/create.ts` y `src/pages/api/repos/create.ts`, después de que la inserción en la base de datos sea exitosa, se realizará una solicitud `fetch` a la `VERCEL_DEPLOY_HOOK_URL`. Esto le dirá a Vercel que inicie un nuevo proceso de construcción.

---

#### **Consideraciones de Seguridad:**

*   **Variables de Entorno:** `ADMIN_USERNAME`, `ADMIN_PASSWORD` y `VERCEL_DEPLOY_HOOK_URL` se almacenarán como variables de entorno en Vercel, **nunca en el código fuente público**.
*   **Autenticación Básica:** El sistema de autenticación propuesto es adecuado para un portafolio personal donde solo tú eres el administrador. Para aplicaciones con múltiples usuarios o requisitos de seguridad más estrictos, se necesitaría una solución de autenticación más robusta (ej. OAuth, JWTs, Firebase Authentication, etc.).
*   **Validación de Entrada:** Es crucial validar todos los datos recibidos de los formularios en los API endpoints para prevenir inyecciones SQL u otros ataques.

**Estado: Pendiente.**

---

### **Fase 5: Despliegue en Vercel y Automatización**

El último paso es poner el sitio online y automatizar las actualizaciones.

1.  **Subir a GitHub:**
    *   Crea un nuevo repositorio en GitHub.com (sin `README` ni `.gitignore`).
    *   Conecta tu repositorio local y sube el código:
    ```bash
    git remote add origin <URL_DEL_REPO_EN_GITHUB>
    git branch -M main
    git pull --rebase origin main # Para integrar cambios remotos si existen
    git push -u origin main
    ```

2.  **Crear Proyecto en Vercel:**
    *   Regístrate o inicia sesión en Vercel.
    *   Haz clic en "Add New... -> Project".
    *   Importa el repositorio que acabas de crear en GitHub.

3.  **Configurar Vercel:**
    *   Vercel detectará que es un proyecto de Astro y configurará los comandos de build (`astro build`) y el directorio de salida (`dist`) automáticamente.
    *   Ve a la pestaña "Settings" -> "Environment Variables".
    *   Añade la variable `DATABASE_URL` con tu cadena de conexión completa.
    *   **IMPORTANTE:** Ve a "Settings" -> "Git" -> "Deploy Hooks". Crea un nuevo Deploy Hook. Dale un nombre (ej. "rebuild-on-content-change") y especifica la rama `main`. Copia la URL del hook.
    *   Vuelve a "Environment Variables" y añade una nueva variable `VERCEL_DEPLOY_HOOK_URL` pegando la URL que acabas de copiar.

4.  **Actualizar API Endpoints:**
    *   Modifica tus archivos `create.ts` en la API. Después de insertar los datos en la base de datos con éxito, añade una llamada `fetch` a la URL del Deploy Hook.
    ```typescript
    // Dentro de tu función de API, tras el INSERT exitoso:
    await fetch(import.meta.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });
    ```

5.  **Desplegar:**
    *   Go to the "Deployments" tab of your project in Vercel and click "Redeploy" for the latest commit.

6.  **Prueba Final:**
    *   Visita la URL que te proporciona Vercel.
    *   Navega a tu sección `/admin/nuevo-post`.
    *   Crea un nuevo post.
    *   Espera 1-2 minutos.
    *   Refresca la página del blog. El nuevo post debería aparecer públicamente.

**Estado: Pendiente.**