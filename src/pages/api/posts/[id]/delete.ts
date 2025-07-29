import { db } from '../../../../lib/db';
import { isAuthenticated } from '../../../../lib/auth';

export const prerender = false;

export async function DELETE({ request, cookies, params }) {
  console.log("DELETE API route hit for posts!");
  if (!isAuthenticated(cookies)) {
    console.log("Authentication failed for delete post.");
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
  }

  const postId = params.id;
  console.log("Attempting to delete post with ID:", postId);

  try {
    const result = await db.query(
      'DELETE FROM blog_posts WHERE id = $1;',
      [postId]
    );

    if (result.rowCount === 0) {
      console.log("Post not found for ID:", postId);
      return new Response(JSON.stringify({ message: 'Post no encontrado' }), { status: 404 });
    }

    console.log("Post deleted successfully for ID:", postId);
        await fetch(import.meta.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });

    return new Response(JSON.stringify({ message: 'Post borrado con éxito' }), { status: 200 });
  } catch (error) {
    console.error("Error al borrar post:", error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
  }
}