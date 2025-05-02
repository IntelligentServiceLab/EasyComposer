import { defineConfig } from 'vite'
import zipPack from "vite-plugin-zip-pack"
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(),
    zipPack({
      inDir: 'dist',  // 输入的文件夹，就是要打包的文件夹
      outDir: 'archive', // 打包好的 zip 文件放到哪个文件夹下
      outFileName: `diary-.zip`, // 打包好的文件名，自行定义
      pathPrefix: ''
  })
  ],
})
