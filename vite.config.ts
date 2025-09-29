import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

const isGitHubPages = process.env.GH_PAGES === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  base: isGitHubPages ? '/react-demo/' : '/',
})
