import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/router": path.resolve(__dirname, "./src/router"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/constants": path.resolve(__dirname, "./src/constants"),
      "@/config": path.resolve(__dirname, "./src/config"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
      "@/services": path.resolve(__dirname, "./src/services"),
    },
  },
  server: {
    // ... other server options
    host: true, // or a specific IP address like '0.0.0.0'
  },
})
