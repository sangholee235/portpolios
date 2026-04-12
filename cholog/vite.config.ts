import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react-swc'
import path from 'path'


export default defineConfig(({ mode }) => ({
  plugins: [react(),
    tailwindcss(),
  ],
  base: mode === 'production' ? '/cholog/' : '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    open: true,
  },
}));
