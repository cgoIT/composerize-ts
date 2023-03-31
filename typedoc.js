module.exports = {
  exclude: ['test/**'],
  entryPoints: ['src/index.ts', 'src/types.ts'],
  excludeInternal: true,
  includes: './src',
  out: 'public',
};
