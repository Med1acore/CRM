import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // ИЗМЕНЕНИЕ БЫЛО ЗДЕСЬ: Указываем правильное имя репозитория
  base: '/CRMCHURCH/',
  server: {
    port: 5177,
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})