import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: './',
    plugins: [react()],
    resolve: {
        // use the component sources directly, no build needed while developing
        alias: {'react-back2top': fileURLToPath(new URL('../packages/react-back2top/src/index.ts', import.meta.url))}
    }
});
