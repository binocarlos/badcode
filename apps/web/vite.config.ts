import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// @badcode/comic is consumed directly from TypeScript source via the workspace,
// so no pre-build step is needed for development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
