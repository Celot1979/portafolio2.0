import { db } from '../../lib/db';

export const prerender = false;

export async function GET() {
  try {
    const result = await db.query('SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 1;');
    if (result.rows.length > 0) {
      return new Response(JSON.stringify(result.rows[0]), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'No posts found.' }), { status: 404 });
    }
  } catch (error) {
    console.error("Error al obtener el último post:", error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor al obtener el post.' }), { status: 500 });
  }
}
