// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
  }),
  {
    ignores: [
      'node_modules/*', // Ignore dependencies
      'dist/*', // Ignore build output
      '**/**.d.ts', // Ignore TypeScript declaration files
      '**.js',
      '**.mjs',
    ],
  },
  {
    // Specify file patterns for linting
    files: [
      'src/**/**.ts',
      'test/**/**.ts',
    ],
    // Define ESLint rules
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...stylistic.configs.customize.rules,
      '@typescript-eslint/no-explicit-any': 'warn', // Warn for `any` usage
      'no-console': 'warn', // Warn for `console.log` usage
    },
  },
];
