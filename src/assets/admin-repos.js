document.addEventListener('DOMContentLoaded', () => {
  alert("Script de repos cargado desde archivo externo!");
  const deleteButtons = document.querySelectorAll('.delete-button');
  console.log("Número de botones de borrar encontrados (repos):", deleteButtons.length);

  deleteButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      console.log("Botón de borrar clickeado (repos)!");
      const repoId = e.target.dataset.id;
      if (confirm(`¿Estás seguro de que quieres borrar el repositorio con ID ${repoId}?`)) {
        try {
          const response = await fetch(`/api/repos/${repoId}/delete`, {
            method: 'DELETE',
          });

          if (response.ok) {
            alert('Repositorio borrado con éxito. El sitio se reconstruirá.');
            e.target.closest('.list-item').remove();
          } else {
            const result = await response.json();
            alert(`Error al borrar el repositorio: ${result.message}`);
          }
        } catch (error) {
          console.error('Error en la solicitud de borrado:', error);
          alert('Ocurrió un error de red al intentar borrar el repositorio.');
        }
      }
    });
  });
});
