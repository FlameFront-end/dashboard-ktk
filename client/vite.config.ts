import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export const pathResolver = (p: string) => path.resolve(__dirname, '.', p);

export default defineConfig({
  base: './',
  publicDir: 'public',
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, './src/components'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/kit': path.resolve(__dirname, './src/features/kit/components'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/pathsConfig': path.resolve(__dirname, './src/router/entities/paths.config.ts'),
      '@/constants': path.resolve(__dirname, './src/constants'),
      '@/globalTypes': path.resolve(__dirname, './src/types/global.types.ts'),
    }
  },
  plugins: [react()]
})
