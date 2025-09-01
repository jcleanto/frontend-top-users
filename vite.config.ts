import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
// import { dependencies } from './package.json';

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
      shared: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        '@mui/x-data-grid',
        // added all for testing
        '@emotion/react',
        '@emotion/styled',
        '@hookform/resolvers',
        '@mui/icons-material',
        '@mui/material',
        'axios',
        'react-hook-form',
        'react-toastify',
        'zod'
      ]
      // shared: [dependencies.react],
    })
  ],
  preview: {
    port: 5001,
    strictPort: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5001,
    strictPort: true,
    origin: "http://0.0.0.0:5001",
    fs: { allow: ['.', '../shared'] },
    open: true
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
