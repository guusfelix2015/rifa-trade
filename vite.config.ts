import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { config } from "dotenv"

config({ path: ".env" });

export default defineConfig({
  plugins: [react()],
  server: { port: 4000 },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
