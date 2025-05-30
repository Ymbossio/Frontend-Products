import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      reporter: ['text', 'html'],
       exclude: [
        'src/main.jsx',
        'vite.config.js',
        'eslint.config.js',
        '**/html/**',              // excluye archivos en /html/
        '**/*.config.js',          // por si tienes más archivos de configuración
        '**/index-*.js',           // archivos generados por Vite
      ], // ⬅️ Esto excluye main.jsx del reporte de cobertura
    },
  },
})
