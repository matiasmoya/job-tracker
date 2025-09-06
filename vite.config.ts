import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import * as path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    RubyPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve('./app/frontend'),
    },
  },
})
