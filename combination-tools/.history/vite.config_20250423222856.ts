import { defineConfig } from 'vite'
import zipPack from "vite-plugin-zip-pack"
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
