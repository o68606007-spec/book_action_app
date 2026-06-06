import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import env from "vite-plugin-env-compatible";
import { resolve } from 'node:path';

export default defineConfig({
    plugins: [react(), env({ prefix: "VITE", mountedPath: "process.env" })],
    test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest-setup.ts'],
    testTimeout: 50000,
    },
    resolve: {
        alias: [{ find: '@', replacement: resolve(__dirname, './src') }]
    },
});