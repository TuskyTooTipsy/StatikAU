import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// STATIK frontend config.
// Production builds use Vite/esbuild directly to avoid React plugin/Babel stalls on large registry data.
// Dev keeps React Fast Refresh enabled.
export default defineConfig(({ command }) => ({
  plugins: command === 'serve' ? [react()] : [],
  esbuild: {
    jsx: 'automatic',
  },
  server: {
    port: 5173,
  },
}));
