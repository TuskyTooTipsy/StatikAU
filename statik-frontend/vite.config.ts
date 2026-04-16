import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the STATIK frontend.
// Defines React plugin and basic server options.

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});