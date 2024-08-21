import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  build: {
    outDir : 'build',
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef 
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
