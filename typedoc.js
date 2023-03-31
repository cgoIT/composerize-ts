module.exports = {
  exclude: ['test/**'],
  entryPoints: ['src/index.ts', 'src/types.ts'],
  excludeInternal: true,
  includes: './src',
  out: 'docs',
  plugin: 'typedoc-plugin-markdown',
};
