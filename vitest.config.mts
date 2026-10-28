import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./test/setup.ts'],
        include: ['test/**/*.test.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            include: ['src/**'],
            reporter: ['text', 'html', 'lcov'],
            thresholds: {lines: 95, functions: 95, branches: 90, statements: 95}
        }
    }
});
