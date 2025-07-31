#!/bin/bash
# Script para iniciar la creación de un nuevo post con el asistente de IA.

echo "Hola, soy tu asistente de creación de posts."
echo "¿Sobre qué tema te gustaría escribir hoy?"
read -p "Tema: " tema

echo ""
echo "¡Excelente! He recibido el tema: '$tema'."
echo "Ahora, por favor, copia y pega la siguiente instrucción en tu chat con Gemini para que pueda empezar a escribir el borrador:"
echo ""
echo "------------------------------------------------------------------"
echo "Ok, el tema para el nuevo post es: '$tema'. Por favor, escribe un borrador y guárdalo en 'borrador_post.md'."
echo "------------------------------------------------------------------"
