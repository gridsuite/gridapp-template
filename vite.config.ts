import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    base: './',
    plugins: [react(), svgr(), tsconfigPaths()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/test/setup.ts',
        css: false,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api/monitor': {
                target: 'http://localhost:5043',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/monitor\//, '/'),
            },
            '/api/gateway': {
                target: 'http://localhost:9000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/gateway\//, '/'),
            },
            '/ws/gateway': {
                target: 'http://localhost:9000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/ws\/gateway\//, '/'),
                ws: true,
            },
            '/api/study-server': {
                target: 'http://localhost:5001',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/study-server\//, '/'),
            },
        },
    },
});
