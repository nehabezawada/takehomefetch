import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        open: true,
        headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            },
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    ui: ['@headlessui/react', '@heroicons/react', 'framer-motion']
                }
            }
        },
        chunkSizeWarningLimit: 1000
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom']
    }
}); 