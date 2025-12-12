import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Isso permite que o código continue usando process.env.API_KEY
      // mesmo rodando no navegador após o build.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});