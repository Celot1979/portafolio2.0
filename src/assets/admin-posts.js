document.addEventListener('DOMContentLoaded', () => {
  alert("Script de posts cargado desde archivo externo!");
  const deleteButtons = document.querySelectorAll('.delete-button');
  console.log("Número de botones de borrar encontrados (posts):", deleteButtons.length);

  deleteButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      console.log("Botón de borrar clickeado (posts)!");
      const postId = e.target.dataset.id;
      if (confirm(`¿Estás seguro de que quieres borrar la entrada con ID ${postId}?`)) {
        try {
          const response = await fetch(`/api/posts/${postId}/delete`, {
            method: 'DELETE',
          });

          if (response.ok) {
            alert('Entrada borrada con éxito. El sitio se reconstruirá.');
            // Opcional: eliminar el elemento del DOM en lugar de recargar
            e.target.closest('.list-item').remove();
          } else {
            const result = await response.json();
            alert(`Error al borrar la entrada: ${result.message}`);
          }
        } catch (error) {
          console.error('Error en la solicitud de borrado:', error);
          alert('Ocurrió un error de red al intentar borrar la entrada.');
        }
      }
    });
  });
});
