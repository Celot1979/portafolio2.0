document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const responseMessage = document.getElementById('response-message');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevenir el envío tradicional del formulario

      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      };

      // Mostrar mensaje de "enviando..."
      responseMessage.textContent = 'Enviando...';
      responseMessage.style.color = '#fff'; // Color neutro

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          responseMessage.textContent = result.message;
          responseMessage.style.color = '#28a745'; // Verde para éxito
          form.reset(); // Limpiar el formulario
        } else {
          responseMessage.textContent = `Error: ${result.message}`;
          responseMessage.style.color = '#dc3545'; // Rojo para error
        }
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
        responseMessage.textContent = 'Error de red. Por favor, inténtalo de nuevo.';
        responseMessage.style.color = '#dc3545'; // Rojo para error
      }
    });
  }
});
