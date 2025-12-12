import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Adiciona um objeto vazio para process.env para evitar crash se alguma lib tentar acessar apenas process.env
      'process.env': {}
    }
  };
});