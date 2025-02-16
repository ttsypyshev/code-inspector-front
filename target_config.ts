import os from 'os';

// Функция для получения локального IP
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const key in interfaces) {
        if (Object.prototype.hasOwnProperty.call(interfaces, key)) {
            const iface = interfaces[key];
            if (!iface) continue; // Проверяем, что iface определен
            for (const config of iface) {
                if (config.family === 'IPv4' && !config.internal) {
                    return config.address;
                }
            }
        }
    }
    return '0.0.0.0';
}

const target_tauri = false;
export const local_ip = getLocalIP();
// export const local_ip = '10.0.0.0';

export const api_proxy_addr = `http://${local_ip}:8080`;
export const img_proxy_addr = `http://${local_ip}:9000`;

export const dest_api = target_tauri ? api_proxy_addr : "api";
export const dest_img = target_tauri ? img_proxy_addr : "img-proxy";
export const dest_root = target_tauri ? "" : "/code-inspector-front";
