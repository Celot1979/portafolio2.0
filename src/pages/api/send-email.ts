import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    // Validación simple de los datos
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ message: 'Todos los campos son obligatorios.' }),
        { status: 400 }
      );
    }

    // Envío del correo
    const { data: responseData, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Remitente (dirección de Resend para desarrollo)
      to: ['dgarciamartinez53@gmail.com'], // Tu dirección de correo
      subject: `Nuevo mensaje de ${name} desde tu portafolio`,
      html: `
        <p>Has recibido un nuevo mensaje de contacto:</p>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error({ error });
      return new Response(
        JSON.stringify({ message: 'Error al enviar el correo.', error: error.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: '¡Correo enviado con éxito!' }),
      { status: 200 }
    );

  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ message: 'Error en el servidor.' }),
      { status: 500 }
    );
  }
};
