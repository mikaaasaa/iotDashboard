import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set the base path for GitHub Pages.
  // If you are deploying to https://<USERNAME>.github.io/<REPO>/, set base to '/<REPO>/'.
  // If you are deploying to https://<USERNAME>.github.io/, set base to '/'.
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
