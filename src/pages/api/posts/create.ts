import { db } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export const prerender = false;

export async function POST({ request, cookies }) {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
  }

  try {
    const { title, content, image_url, seo_description } = await request.json();

    if (!title || !content) {
      return new Response(JSON.stringify({ message: 'Título y contenido son requeridos' }), { status: 400 });
    }

    const result = await db.query(
      'INSERT INTO blog_posts (title, content, image_url, seo_description, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id;',
      [title, content, image_url, seo_description]
    );

        // Si la URL del deploy hook existe (en producción), llamarla
    if (import.meta.env.VERCEL_DEPLOY_HOOK_URL) {
      await fetch(import.meta.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });
    }

    return new Response(JSON.stringify({ message: 'Post creado con éxito', id: result.rows[0].id }), { status: 201 });
  } catch (error) {
    console.error("Error al crear post:", error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
  }
}