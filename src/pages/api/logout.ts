import { removeSessionCookie } from '../../lib/auth';

export const prerender = false;

export async function POST({ cookies }) {
  removeSessionCookie(cookies); // Pasar el objeto cookies

  return new Response(JSON.stringify({ message: 'Logout exitoso' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
