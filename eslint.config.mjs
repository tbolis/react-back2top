import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
    {ignores: ['lib/', 'coverage/', 'dist-examples/', 'node_modules/']},
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {globals: {...globals.browser}},
        plugins: {'react-hooks': reactHooks},
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn'
        }
    },
    {files: ['*.config.{js,mjs,mts}'], languageOptions: {globals: {...globals.node}}}
);
