import { verifyCredentials, setSessionCookie } from '../../lib/auth';

export const prerender = false;

export async function POST({ request, cookies }) {
  console.log("Login API route hit!");
  console.log("Request method:", request.method);
  console.log("Request headers:", Object.fromEntries(request.headers.entries()));

  let rawBody;
  try {
    rawBody = await request.text();
    console.log("Raw request body:", rawBody);
  } catch (e) {
    console.error("Error al leer el cuerpo de la solicitud como texto:", e);
    return new Response(JSON.stringify({ message: 'Error al leer el cuerpo de la solicitud' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  let data;
  try {
    data = JSON.parse(rawBody);
    console.log("Parsed data:", data);
  } catch (e) {
    console.error("Error al parsear JSON:", e);
    return new Response(JSON.stringify({ message: 'JSON inválido en el cuerpo de la solicitud' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { username, password } = data;

  if (verifyCredentials(username, password)) {
    const sessionToken = 'super-secret-admin-token';
    setSessionCookie(sessionToken, cookies); // Pasar el objeto cookies

    return new Response(JSON.stringify({ message: 'Login exitoso' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else {
    return new Response(JSON.stringify({ message: 'Credenciales inválidas' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}