import { db } from '../../../../lib/db';
import { isAuthenticated } from '../../../../lib/auth';

export const prerender = false;

export async function PUT({ request, cookies, params }) {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
  }

  const projectId = params.id;

  try {
    const { title, url, image_url, description } = await request.json();

    if (!title || !description || !url) {
      return new Response(JSON.stringify({ message: 'Título, URL y descripción son requeridos' }), { status: 400 });
    }

    const result = await db.query(
      'UPDATE repositories SET title = $1, url = $2, image_url = $3, description = $4, updated_at = NOW() WHERE id = $5 RETURNING id;',
      [title, url, image_url, description, projectId]
    );

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ message: 'Proyecto no encontrado' }), { status: 404 });
    }

        await fetch(import.meta.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });

    return new Response(JSON.stringify({ message: 'Proyecto actualizado con éxito' }), { status: 200 });
  } catch (error) {
    console.error("Error al actualizar proyecto:", error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
  }
}
