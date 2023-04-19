import * as esbuild from 'esbuild';

await esbuild.build({
  bundle: true,
  entryPoints: ['src/app.ts'],
  outdir: 'dist',
  platform: 'node',
  target: 'node18',
  packages: 'external',
  sourcemap: true,
});
