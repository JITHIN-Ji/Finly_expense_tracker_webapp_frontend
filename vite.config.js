import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // bind to 0.0.0.0 so ngrok can reach the dev server
    port: 5173, // change if your dev server runs on a different port
    strictPort: true,
    allowedHosts: [
      'supercriminally-ununified-arnoldo.ngrok-free.dev',
      
    ],
    hmr: {
      
      clientPort: 443,
    },
  },
})