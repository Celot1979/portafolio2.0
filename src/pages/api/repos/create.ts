import { db } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export const prerender = false;

export async function POST({ request, cookies }) {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
  }

  try {
    const { title, url, image_url, description } = await request.json();

    if (!title || !description || !url) { // 'url' es not null en tu esquema
      return new Response(JSON.stringify({ message: 'Título, URL y descripción son requeridos' }), { status: 400 });
    }

    const result = await db.query(
      'INSERT INTO repositories (title, url, image_url, description) VALUES ($1, $2, $3, $4) RETURNING id;',
      [title, url, image_url, description]
    );

    // TODO: Activar Vercel Deploy Hook aquí
    // await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });

    return new Response(JSON.stringify({ message: 'Proyecto creado con éxito', id: result.rows[0].id }), { status: 201 });
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
  }
}