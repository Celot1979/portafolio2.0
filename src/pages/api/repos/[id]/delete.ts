import { db } from '../../../../lib/db';
import { isAuthenticated } from '../../../../lib/auth';

export const prerender = false;

export async function DELETE({ request, cookies, params }) {
  console.log("DELETE API route hit for repos!");
  if (!isAuthenticated(cookies)) {
    console.log("Authentication failed for delete repo.");
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
  }

  const projectId = params.id;
  console.log("Attempting to delete project with ID:", projectId);

  try {
    const result = await db.query(
      'DELETE FROM repositories WHERE id = $1;',
      [projectId]
    );

    if (result.rowCount === 0) {
      console.log("Project not found for ID:", projectId);
      return new Response(JSON.stringify({ message: 'Proyecto no encontrado' }), { status: 404 });
    }

    console.log("Project deleted successfully for ID:", projectId);
    // TODO: Activar Vercel Deploy Hook aquí
    // await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });

    return new Response(JSON.stringify({ message: 'Proyecto borrado con éxito' }), { status: 200 });
  } catch (error) {
    console.error("Error al borrar proyecto:", error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
  }
}