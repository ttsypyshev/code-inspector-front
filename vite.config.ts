import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import {local_ip, api_proxy_addr, img_proxy_addr} from "./target_config"

export default defineConfig({
  server: {
    host: '0.0.0.0',  // Прослушиваем все интерфейсы
    port: 3000,
    hmr: {
      host: local_ip,  // or '127.0.0.1' depending on your environment
      port: 3000,
      protocol: 'ws',
    },    
    proxy: {
      "/api": {
        target: api_proxy_addr,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
      "/img-proxy": {
        target: img_proxy_addr,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img-proxy/, "/"),
      },
    },
  },
  // base: dest_root,
  plugins: [react()],
})
