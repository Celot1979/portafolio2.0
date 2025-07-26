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

Implementaremos la sección de administración para añadir nuevo contenido.

1.  **Crear Formularios de Administración:**
    *   Crea las páginas `src/pages/admin/nuevo-post.astro` y `src/pages/admin/nuevo-repo.astro`.
    *   Cada página contendrá un formulario HTML para enviar los datos del nuevo contenido.

2.  **Crear API Endpoints (Serverless Functions):**
    *   Crea el archivo `src/pages/api/posts/create.ts`.
    *   Este será el endpoint que reciba los datos del formulario de nuevo post. Implementará la lógica para:
        a.  **Validar la autenticación** (provisionalmente se puede omitir para pruebas locales).
        b.  Recibir los datos del `request`.
        c.  Insertar los datos en la tabla `posts` de PostgreSQL.
        d.  Devolver una respuesta de éxito o error.
    *   Repite el proceso para los repositorios en `src/pages/api/repos/create.ts`.

3.  **Añadir Lógica en el Frontend:**
    *   En los archivos `.astro` de los formularios, añade un `<script>` que intercepte el `submit` del formulario, envíe los datos al API endpoint correspondiente usando `fetch`, y muestre un mensaje al usuario.

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