import { db } from '../../../../lib/db';
import { isAuthenticated } from '../../../../lib/auth';

export const prerender = false;

export async function PUT({ request, cookies, params }) {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
  }

  const postId = params.id;

  try {
    const { title, content, image_url, seo_description } = await request.json();

    if (!title || !content) {
      return new Response(JSON.stringify({ message: 'Título y contenido son requeridos' }), { status: 400 });
    }

    const result = await db.query(
      'UPDATE blog_posts SET title = $1, content = $2, image_url = $3, seo_description = $4, updated_at = NOW() WHERE id = $5 RETURNING id;',
      [title, content, image_url, seo_description, postId]
    );

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ message: 'Post no encontrado' }), { status: 404 });
    }

        // Si la URL del deploy hook existe (en producción), llamarla
    if (import.meta.env.VERCEL_DEPLOY_HOOK_URL) {
      await fetch(import.meta.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });
    }

    return new Response(JSON.stringify({ message: 'Post actualizado con éxito' }), { status: 200 });
  } catch (error) {
    console.error("Error al actualizar post:", error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
  }
}
