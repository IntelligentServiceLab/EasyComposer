import { defineConfig } from 'vite'
import zipPack from "vite-plugin-zip-pack"
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(),
    zipPack({
      inDir: 'dist',  // 输入的文件夹，就是要打包的文件夹
      outDir: 'archive', // 打包好的 zip 文件放到哪个文件夹下
      outFileName: `diary-${timeStringNow}.zip`, // 打包好的文件名，自行定义，这里我定义了一个 timeStringNow 变量，放置了此时此刻的时间 2024-01-06 这样的
      pathPrefix: ''
  })
  ],
})
