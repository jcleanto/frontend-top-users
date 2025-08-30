import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'frontend_top_users',
      filename: 'remoteEntry.js',
      exposes: {
        './ListUserPage': './src/user/crud/list.user.page.tsx',
        './CreateUserPage': './src/user/crud/create.user.page.tsx',
        './EditUserPage': './src/user/crud/edit.user.page.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', '@mui/x-data-grid']
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
