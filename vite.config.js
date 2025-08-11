import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    optimizeDeps: {
    include: [
      '@radix-ui/react-switch',
      // Add other Radix UI components you're using
    ],
    exclude: ['js-big-decimal']
  },
  server: {
    hmr: {
      overlay: false
    }
  }
});
