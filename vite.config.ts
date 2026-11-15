import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import hosting from './vercel.json';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Exercise the same security policy in local production preview and on Vercel.
  preview: { headers: Object.fromEntries(hosting.headers.flatMap(rule => rule.headers.map(header => [header.key, header.value]))) },
  test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], restoreMocks: true },
});
