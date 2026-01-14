import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  envDir: './config',
  server: {
    port: 5673,
    host: true,
    strictPort: true,
    allowedHosts: ['thelaststickynote.altovation.in', 'localhost'],
  },
})
