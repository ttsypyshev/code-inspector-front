const target_tauri = false

// Переменная для локального IP
export const local_ip = "192.168.1.26"

// Используем шаблонные строки для вставки переменной
export const api_proxy_addr = `http://${local_ip}:8080`
export const img_proxy_addr = `http://${local_ip}:9000`

// Настройки назначения в зависимости от значения target_tauri
export const dest_api = (target_tauri) ? api_proxy_addr : "api"
export const dest_img =  (target_tauri) ? img_proxy_addr : "img-proxy"
export const dest_root = (target_tauri) ? "" : "/code-inspector-front"
