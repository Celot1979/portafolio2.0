// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless'; // Importar el adaptador

// https://astro.build/config
export default defineConfig({
  output: 'server', // Indicar que el output es para un servidor
  adapter: vercel(), // Usar el adaptador de Vercel
});
