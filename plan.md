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

### **Fase 4: Creación del Sistema de Gestión (Backend) - Ampliada con CRUD**

**Objetivo Principal:** Permitir la creación, visualización, modificación y eliminación de contenido (entradas de blog y proyectos) a través de una interfaz web segura, y automatizar la actualización del portafolio al gestionar el contenido.

Esta fase se centrará en la creación de una sección de administración básica pero funcional, accesible solo para ti.

---

#### **Componentes Clave de esta Fase (Actualizados):**

1.  **Autenticación (Login/Logout):** (Ya implementado)
2.  **Panel de Administración (Dashboard):** (Ya implementado, pero se añadirán enlaces a las nuevas vistas de listado).
3.  **Formularios de Creación de Contenido:** Interfaces para añadir nuevas entradas de blog y nuevos proyectos.
4.  **Vistas de Listado de Contenido:** Páginas para ver y gestionar (editar/borrar) todas las entradas de blog y proyectos existentes.
5.  **Formularios de Edición de Contenido:** Interfaces para modificar entradas de blog y proyectos existentes.
6.  **API Endpoints (Serverless Functions) para CRUD:** Funciones que manejarán las operaciones de Crear, Leer (para admin), Actualizar y Borrar en la base de datos.
7.  **Integración con Vercel Deploy Hook:** Para que el sitio se reconstruya automáticamente al gestionar el contenido.

---

#### **Plan de Implementación Detallado (Paso a Paso - Actualizado):**

**Paso 1: Configuración de la Autenticación Básica**
*   (Ya completado: `.env` con credenciales, `src/lib/auth.ts`, `src/pages/admin/login.astro`, `src/pages/api/login.ts`, `src/pages/api/logout.ts`, protección de rutas).

**Paso 2: Creación del Panel de Administración (Dashboard)**
*   (Ya completado: `src/pages/admin/index.astro`).
*   **Modificación:** Añadiremos enlaces a las nuevas páginas de listado de posts y proyectos.

**Paso 3: Creación de Formularios para Nuevo Contenido**
*   **Propósito:** Proporcionar interfaces para añadir nuevas entradas de blog y proyectos.
*   **Archivos a Crear:**
    *   `portafolio2.0/src/pages/admin/nuevo-post.astro`: Formulario para crear un nuevo post.
    *   `portafolio2.0/src/pages/admin/nuevo-repo.astro`: Formulario para crear un nuevo proyecto.
*   **Consideraciones:** Estos formularios enviarán datos a los API Endpoints de creación.

**Paso 4: Implementación de Vistas de Listado de Contenido para Administración**
*   **Propósito:** Mostrar una lista de todo el contenido existente con opciones para editar o borrar cada elemento.
*   **Archivos a Crear:**
    *   `portafolio2.0/src/pages/admin/posts/index.astro`:
        *   Listará todas las entradas de `blog_posts`.
        *   Cada entrada tendrá un botón "Editar" (que enlazará a `admin/posts/[id]/edit`) y un botón "Borrar".
        *   Incluirá la lógica para obtener los datos de la base de datos.
    *   `portafolio2.0/src/pages/admin/repos/index.astro`:
        *   Similar a la anterior, pero para la tabla `repositories`.
        *   Cada proyecto tendrá un botón "Editar" (que enlazará a `admin/repos/[id]/edit`) y un botón "Borrar".

**Paso 5: Creación de Formularios de Edición de Contenido**
*   **Propósito:** Permitir la modificación de entradas de blog y proyectos existentes.
*   **Archivos a Crear:**
    *   `portafolio2.0/src/pages/admin/posts/[id]/edit.astro`:
        *   Formulario similar al de creación, pero pre-rellenado con los datos del post correspondiente.
        *   El formulario enviará los datos a un API Endpoint de actualización.
    *   `portafolio2.0/src/pages/admin/repos/[id]/edit.astro`:
        *   Similar a la anterior, pero para proyectos.

**Paso 6: Implementación de API Endpoints (Serverless Functions) para CRUD**
*   **Propósito:** Manejar las operaciones de base de datos para el contenido.
*   **Archivos a Crear/Modificar:**
    *   **Crear (POST):**
        *   `portafolio2.0/src/pages/api/posts/create.ts`: Recibe datos y los inserta en `blog_posts`.
        *   `portafolio2.0/src/pages/api/repos/create.ts`: Recibe datos y los inserta en `repositories`.
    *   **Actualizar (PUT/PATCH):**
        *   `portafolio2.0/src/pages/api/posts/[id]/update.ts`: Recibe datos y actualiza una entrada específica en `blog_posts`.
        *   `portafolio2.0/src/pages/api/repos/[id]/update.ts`: Recibe datos y actualiza un proyecto específico en `repositories`.
    *   **Borrar (DELETE):**
        *   `portafolio2.0/src/pages/api/posts/[id]/delete.ts`: Recibe una solicitud para borrar una entrada específica de `blog_posts`.
        *   `portafolio2.0/src/pages/api/repos/[id]/delete.ts`: Recibe una solicitud para borrar un proyecto específico de `repositories`.
*   **Consideraciones:** Todos estos endpoints deberán verificar la autenticación del administrador.

**Paso 7: Integración con Vercel Deploy Hook para Reconstrucción Automática**
*   **Propósito:** Asegurar que cada vez que se cree, actualice o elimine contenido, tu sitio estático se reconstruya y se despliegue automáticamente con los nuevos datos.
*   **Configuración en Vercel (Manual):** (Ya explicado en el plan original).
*   **Activación desde API Endpoints (Código):**
    *   En **todos** los API Endpoints de creación, actualización y eliminación (`create.ts`, `update.ts`, `delete.ts` para posts y repos), después de que la operación en la base de datos sea exitosa, se realizará una solicitud `fetch` a la `VERCEL_DEPLOY_HOOK_URL`.

---

#### **Consideraciones Adicionales:**

*   **Validación de Entrada:** Es crucial validar todos los datos recibidos de los formularios en los API endpoints para prevenir inyecciones SQL u otros ataques.
*   **Manejo de Errores:** Implementar un manejo de errores robusto en todos los API endpoints y en el frontend para proporcionar feedback claro al usuario.
*   **Confirmación de Borrado:** Para las operaciones de borrado, se implementará una confirmación en el frontend para evitar eliminaciones accidentales.

**Estado: En progreso.**

---

### **Problema Actual: Botones de Borrado No Funcionan**

*   **Descripción:** Los botones "Borrar" en las páginas de gestión de posts (`/admin/posts`) y proyectos (`/admin/repos`) no desencadenan ninguna acción. No se observan mensajes en la consola del navegador ni solicitudes de red cuando se hace clic.
*   **Diagnóstico:** El JavaScript del lado del cliente responsable de manejar el evento `click` no se está ejecutando en el navegador.
*   **Pasos de Depuración Tomados:**
    *   Se añadió la directiva `client:load` a los `<script>` tags en `src/pages/admin/posts/index.astro` y `src/pages/admin/repos/index.astro`.
    *   Se eliminó el `document.addEventListener('DOMContentLoaded', ...)` y se colocó el código directamente dentro del `<script client:load>`.
    *   Se añadió un `alert()` al principio del `<script client:load>` para verificar la ejecución del script. **Este `alert()` no aparece en el navegador.**
    *   Se corrigió un `SyntaxError` (`expected expression, got ')'`) causado por un `});` extra en los scripts.
*   **Hipótesis:** A pesar de `client:load`, el JavaScript dentro de estos componentes específicos de Astro no está siendo hidratado o ejecutado en el lado del cliente. Esto podría deberse a:
    *   Un problema más fundamental con la configuración de Astro o con la forma en que los scripts se están cargando en tu entorno.
    *   Un conflicto con otras partes del código o integraciones (ej. `ViewTransitions`).
*   **Próximos Pasos para Depuración:**
    *   **Verificar errores en la consola del navegador:** Asegurarse de que no haya errores de JavaScript en la consola (F12) *antes* de intentar interactuar con los botones.
    *   **Simplificar el script al mínimo:** Reducir el contenido del `<script client:load>` a solo un `alert()` para confirmar si *cualquier* JavaScript puede ejecutarse en ese contexto. (Ya se hizo, y el `alert` no aparece, lo que es preocupante).
    *   **Desactivar `ViewTransitions` temporalmente:** Eliminar `<ViewTransitions />` de `src/layouts/Layout.astro` para descartar cualquier interferencia con la carga de scripts.
    *   **Mover el JavaScript a un archivo `.js` externo:** En lugar de scripts inline, crear un archivo `.js` separado, importarlo en el componente Astro y ver si eso cambia el comportamiento de carga.

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