#!/bin/bash

# Colores para la interfaz
C_CYAN="\033[36m"
C_GREEN="\033[32m"
C_YELLOW="\033[33m"
C_RED="\033[31m"
C_RESET="\033[0m"

# API Key de ImgBB (guardada en memoria)
IMGBB_API_KEY="532585de515509bdd34416ddc909f8e6"

# Archivo temporal para la cookie de sesión
COOKIE_FILE="/tmp/admin_session_cookie.txt"

# Función para intentar copiar al portapapeles
copy_to_clipboard() {
    local text_to_copy=$1
    local success=false
    if command -v xclip &> /dev/null; then
        echo -n "$text_to_copy" | xclip -selection clipboard
        success=true
    elif command -v pbcopy &> /dev/null; then
        echo -n "$text_to_copy" | pbcopy
        success=true
    fi

    if [ "$success" = true ]; then
        echo -e "${C_GREEN}¡Instrucción copiada al portapapeles!${C_RESET}"
    fi
}

# Función para subir una imagen a ImgBB
upload_image_to_imgbb() {
    local image_url=$1
    echo -e "${C_YELLOW}Subiendo imagen a ImgBB...${C_RESET}" >&2
    response=$(curl -s --location --request POST "https://api.imgbb.com/1/upload?key=$IMGBB_API_KEY" --form "image=$image_url")
    
    # Verificar si jq está instalado
    if ! command -v jq &> /dev/null; then
        echo -e "${C_RED}Error: 'jq' no está instalado. Por favor, instálalo para procesar las respuestas JSON.${C_RESET}" >&2
        echo -e "${C_RED}Ej: sudo apt-get install jq (Debian/Ubuntu) o brew install jq (macOS)${C_RESET}" >&2
        return 1
    fi

    img_url=$(echo "$response" | jq -r '.data.url')
    if [ "$img_url" == "null" ] || [ -z "$img_url" ]; then
        echo -e "${C_RED}Error al subir la imagen a ImgBB. Respuesta: ${response}${C_RESET}" >&2
        return 1
    fi
    echo -e "${C_GREEN}Imagen subida: ${img_url}${C_RESET}" >&2
    echo "$img_url"
    return 0
}

# Función para iniciar sesión y obtener la cookie
login_and_get_cookie() {
    echo -e "${C_YELLOW}Necesitamos tus credenciales de administrador para publicar.${C_RESET}"
    read -p "Usuario: " admin_username
    read -s -p "Contraseña: " admin_password
    echo ""

    echo -e "${C_YELLOW}Intentando iniciar sesión...${C_RESET}" >&2
    login_response=$(curl -s -X POST -H "Content-Type: application/json" \
        -d "{\"username\": \"$admin_username\", \"password\": \"$admin_password\"}" \
        -c "$COOKIE_FILE" \
        http://localhost:4321/api/login)

    if [ -f "$COOKIE_FILE" ] && grep -q "admin_session" "$COOKIE_FILE"; then
        echo -e "${C_GREEN}Inicio de sesión exitoso.${C_RESET}" >&2
        return 0
    else
        echo -e "${C_RED}Error al iniciar sesión. Verifica tus credenciales. Respuesta: ${login_response}${C_RESET}" >&2
        return 1
    fi
}

# Función para gestionar posts
manage_posts() {
    while true; do
        echo -e "\n${C_CYAN}--- Gestión de Posts ---${C_RESET}"
        echo "[1] Crear un nuevo borrador de post"
        echo "[2] Añadir imágenes al borrador de post"
        echo "[3] Finalizar y renombrar el post"
        echo "[4] Publicar Post"
        echo -e "[5] Volver al menú principal"
        echo -e "${C_CYAN}------------------------${C_RESET}"
        read -p "Elige una opción: " post_choice

        case $post_choice in
            1)
                echo ""
                read -p "Tema para el nuevo post: " tema
                instruction="Ok, el tema para el nuevo post es: '$tema'. Por favor, escribe un borrador y guárdalo en 'borrador_post.md'."
                echo -e "\n${C_YELLOW}--- COPIA Y PEGA ESTA INSTRUCCIÓN EN GEMINI ---${C_RESET}"
                echo "$instruction"
                echo -e "${C_YELLOW}-------------------------------------------------${C_RESET}\n"
                copy_to_clipboard "$instruction"
                read -p "Presiona Enter para volver al menú..."
                ;;
            2)
                if [ ! -f "borrador_post.md" ]; then
                    echo -e "\n${C_RED}Error: No se encuentra el archivo 'borrador_post.md'. Por favor, crea primero un borrador (Opción 1).${C_RESET}\n"
                    read -p "Presiona Enter para continuar..."
                    continue
                fi
                echo ""
                read -p "Pega la URL de la imagen a añadir: " image_url
                read -p "Insértala ANTES o DESPUÉS de qué frase/palabra clave: " target_text
                read -p "¿Insertar [a]ntes o [d]espués de la frase?: " position

                pos_text="antes"
                if [[ "$position" == "d" || "$position" == "D" ]]; then
                    pos_text="después"
                fi

                instruction="Vale. ${pos_text^} de: '$target_text' implementa esta imagen: '$image_url'"
                echo -e "\n${C_YELLOW}--- COPIA Y PEGA ESTA INSTRUCCIÓN EN GEMINI ---${C_RESET}"
                echo "$instruction"
                echo -e "${C_YELLOW}-------------------------------------------------${C_RESET}\n"
                copy_to_clipboard "$instruction"
                read -p "Presiona Enter para volver al menú..."
                ;;
            3)
                if [ ! -f "borrador_post.md" ]; then
                    echo -e "\n${C_RED}Error: No se encuentra el archivo 'borrador_post.md'.${C_RESET}\n"
                    read -p "Presiona Enter para continuar..."
                    continue
                fi
                echo ""
                read -p "Nombre final para el archivo (ej: mi_post.md): " final_name
                instruction="El archivo borrador_post.md cambia el nombre por: '$final_name'"
                echo -e "\n${C_YELLOW}--- COPIA Y PEGA ESTA INSTRUCCIÓN EN GEMINI ---${C_RESET}"
                echo "$instruction"
                echo -e "${C_YELLOW}-------------------------------------------------${C_RESET}\n"
                copy_to_clipboard "$instruction"
                read -p "Presiona Enter para volver al menú..."
                ;;
            4)
                echo -e "\n${C_CYAN}--- Publicar Nuevo Post ---${C_RESET}"
                read -p "Ruta del archivo Markdown del post (ej: mi_post.md): " post_file

                if [ ! -f "$post_file" ]; then
                    echo -e "${C_RED}Error: El archivo '$post_file' no existe.${C_RESET}"
                    read -p "Presiona Enter para continuar..."
                    continue
                fi

                read -p "URL de la imagen de cabecera del post: " header_image_url
                read -p "Descripción SEO (palabras clave): " seo_description

                # Subir imagen de cabecera a ImgBB
                uploaded_header_image_url=$(upload_image_to_imgbb "$header_image_url")
                if [ $? -ne 0 ]; then
                    read -p "Presiona Enter para volver al menú..."
                    continue
                fi

                # Leer contenido del post y extraer título
                post_content=$(cat "$post_file")
                post_title=$(echo "$post_content" | grep -m 1 -E "^#+" | sed -E 's/^#+ //')

                if [ -z "$post_title" ]; then
                    echo -e "${C_RED}Error: No se pudo extraer el título del post. Asegúrate de que la primera línea sea un encabezado Markdown (ej: # Mi Título).${C_RESET}"
                    read -p "Presiona Enter para volver al menú..."
                    continue
                fi

                echo -e "${C_GREEN}Título extraído: ${post_title}${C_RESET}"

                # Iniciar sesión y obtener cookie
                if ! login_and_get_cookie; then
                    read -p "Presiona Enter para volver al menú..."
                    continue
                fi

                echo -e "${C_YELLOW}Enviando post a la API...${C_RESET}"
                # Construir el payload JSON completo usando jq para un escape robusto
                JSON_PAYLOAD=$(jq -n \
                  --arg title "$post_title" \
                  --arg content "$post_content" \
                  --arg image_url "$uploaded_header_image_url" \
                  --arg seo_description "$seo_description" \
                  '{title: $title, content: $content, image_url: $image_url, seo_description: $seo_description}')

                echo -e "${C_YELLOW}JSON Payload being sent:${C_RESET}" >&2
                echo "$JSON_PAYLOAD" >&2

                publish_response=$(curl -s -X POST -H "Content-Type: application/json" \
                    -b "$COOKIE_FILE" \
                    -d "$JSON_PAYLOAD" \
                    http://localhost:4321/api/posts/create)

                echo -e "${C_GREEN}Respuesta de la API: ${publish_response}${C_RESET}"
                rm -f "$COOKIE_FILE" # Limpiar cookie temporal
                read -p "Presiona Enter para volver al menú..."
                ;;
            5)
                break
                ;;
            *)
                echo -e "\n${C_RED}Opción no válida. Por favor, elige un número del 1 al 5.${C_RESET}\n"
                read -p "Presiona Enter para continuar..."
                ;;
        esac
        echo ""
    done
}

# Función para gestionar repositorios
manage_repos() {
    while true; do
        echo -e "\n${C_CYAN}--- Gestión de Repositorios ---${C_RESET}"
        echo "[1] Crear un nuevo borrador de repositorio"
        echo "[2] Añadir imágenes al borrador de repositorio"
        echo "[3] Finalizar y renombrar el repositorio"
        echo "[4] Publicar Repositorio"
        echo -e "[5] Volver al menú principal"
        echo -e "${C_CYAN}-----------------------------${C_RESET}"
        read -p "Elige una opción: " repo_choice

        case $repo_choice in
            1)
                echo ""
                read -p "Título para el nuevo repositorio: " repo_title
                instruction="Ok, el título para el nuevo repositorio es: '$repo_title'. Por favor, escribe un borrador de la descripción y guárdalo en 'borrador_repo.md'."
                echo -e "\n${C_YELLOW}--- COPIA Y PEGA ESTA INSTRUCCIÓN EN GEMINI ---${C_RESET}"
                echo "$instruction"
                echo -e "${C_YELLOW}-------------------------------------------------${C_RESET}\n"
                copy_to_clipboard "$instruction"
                read -p "Presiona Enter para volver al menú..."
                ;;
            2)
                if [ ! -f "borrador_repo.md" ]; then
                    echo -e "\n${C_RED}Error: No se encuentra el archivo 'borrador_repo.md'. Por favor, crea primero un borrador (Opción 1).${C_RESET}\n"
                    read -p "Presiona Enter para continuar..."
                    continue
                fi
                echo ""
                read -p "Pega la URL de la imagen a añadir: " image_url
                read -p "Insértala ANTES o DESPUÉS de qué frase/palabra clave: " target_text
                read -p "¿Insertar [a]ntes o [d]espués de la frase?: " position

                pos_text="antes"
                if [[ "$position" == "d" || "$position" == "D" ]]; then
                    pos_text="después"
                fi

                instruction="Vale. ${pos_text^} de: '$target_text' en 'borrador_repo.md' implementa esta imagen: '$image_url'"
                echo -e "\n${C_YELLOW}--- COPIA Y PEGA ESTA INSTRUCCIÓN EN GEMINI ---${C_RESET}"
                echo "$instruction"
                echo -e "${C_YELLOW}-------------------------------------------------${C_RESET}\n"
                copy_to_clipboard "$instruction"
                read -p "Presiona Enter para volver al menú..."
                ;;
            3)
                if [ ! -f "borrador_repo.md" ]; then
                    echo -e "\n${C_RED}Error: No se encuentra el archivo 'borrador_repo.md'.${C_RESET}\n"
                    read -p "Presiona Enter para continuar..."
                    continue
                fi
                echo ""
                read -p "Nombre final para el archivo (ej: mi_repo.md): " final_name
                instruction="El archivo borrador_repo.md cambia el nombre por: '$final_name'"
                echo -e "\n${C_YELLOW}--- COPIA Y PEGA ESTA INSTRUCCIÓN EN GEMINI ---${C_RESET}"
                echo "$instruction"
                echo -e "${C_YELLOW}-------------------------------------------------${C_RESET}\n"
                copy_to_clipboard "$instruction"
                read -p "Presiona Enter para volver al menú..."
                ;;
            4)
                echo -e "\n${C_CYAN}--- Publicar Nuevo Repositorio ---${C_RESET}"
                read -p "Ruta del archivo Markdown del repositorio (ej: mi_repo.md): " repo_file

                if [ ! -f "$repo_file" ]; then
                    echo -e "${C_RED}Error: El archivo '$repo_file' no existe.${C_RESET}"
                    read -p "Presiona Enter para continuar..."
                    continue
                fi

                read -p "URL del repositorio (ej: https://github.com/usuario/repo): " repo_url
                read -p "URL de la imagen de cabecera del repositorio: " header_image_url

                # Subir imagen de cabecera a ImgBB
                uploaded_header_image_url=$(upload_image_to_imgbb "$header_image_url")
                if [ $? -ne 0 ]; then
                    read -p "Presiona Enter para volver al menú..."
                    continue
                fi

                # Leer contenido del repositorio y extraer título y descripción
                repo_content=$(cat "$repo_file")
                repo_title=$(echo "$repo_content" | grep -m 1 -E "^#+" | sed -E 's/^#+ //')
                repo_description="$repo_content" # La descripción es el contenido completo del Markdown

                if [ -z "$repo_title" ]; then
                    echo -e "${C_RED}Error: No se pudo extraer el título del repositorio. Asegúrate de que la primera línea sea un encabezado Markdown (ej: # Mi Repositorio).${C_RESET}"
                    read -p "Presiona Enter para volver al menú..."
                    continue
                fi

                echo -e "${C_GREEN}Título extraído: ${repo_title}${C_RESET}"

                # Iniciar sesión y obtener cookie
                if ! login_and_get_cookie; then
                    read -p "Presiona Enter para volver al menú..."
                    continue
                fi

                echo -e "${C_YELLOW}Enviando repositorio a la API...${C_RESET}"
                # Construir el payload JSON completo usando jq para un escape robusto
                JSON_PAYLOAD=$(jq -n \
                  --arg title "$repo_title" \
                  --arg url "$repo_url" \
                  --arg image_url "$uploaded_header_image_url" \
                  --arg description "$repo_description" \
                  '{title: $title, url: $url, image_url: $image_url, description: $description}')

                echo -e "${C_YELLOW}JSON Payload being sent:${C_RESET}" >&2
                echo "$JSON_PAYLOAD" >&2

                publish_response=$(curl -s -X POST -H "Content-Type: application/json" \
                    -b "$COOKIE_FILE" \
                    -d "$JSON_PAYLOAD" \
                    http://localhost:4321/api/repos/create)

                echo -e "${C_GREEN}Respuesta de la API: ${publish_response}${C_RESET}"
                rm -f "$COOKIE_FILE" # Limpiar cookie temporal
                read -p "Presiona Enter para volver al menú..."
                ;;
            5)
                break
                ;;
            *)
                echo -e "\n${C_RED}Opción no válida. Por favor, elige un número del 1 al 5.${C_RESET}\n"
                read -p "Presiona Enter para continuar..."
                ;;
        esac
        echo ""
    done
}

# Menú principal de la herramienta
while true; do
    echo -e "${C_CYAN}--- Asistente Principal ---${C_RESET}"
    echo "[1] Gestionar Posts"
    echo "[2] Gestionar Repositorios"
    echo -e "[3] Salir"
    echo -e "${C_CYAN}-------------------------${C_RESET}"
    read -p "Elige una opción: " main_choice

    case $main_choice in
        1)
            manage_posts
            ;;
        2)
            manage_repos
            ;;
        3)
            echo "¡Hasta la próxima!"
            rm -f "$COOKIE_FILE" # Limpiar cookie temporal al salir
            break
            ;;
        *)
            echo -e "\n${C_RED}Opción no válida. Por favor, elige un número del 1 al 3.${C_RESET}\n"
            read -p "Presiona Enter para continuar..."
            ;;
    esac
    echo ""
done