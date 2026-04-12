import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SUB_PROJECTS = ['gomin', 'techmate', 'cholog']

export default defineConfig({
  plugins: [
    react(),
    {
      // 로컬 dev: /gomin/, /techmate/, /cholog/ 요청을 각 index.html로 서빙
      name: 'serve-sub-projects',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url?.split('?')[0] ?? ''
          for (const proj of SUB_PROJECTS) {
            if (url === `/${proj}` || url === `/${proj}/` || url.startsWith(`/${proj}/`)) {
              const ext = path.extname(url)
              // .js/.css/.png 등 정적 에셋은 Vite 기본 처리에 맡김
              if (ext && ext !== '.html') {
                return next()
              }
              // 앱 라우트 → 서브 프로젝트 index.html 반환
              const indexPath = path.resolve(__dirname, `public/${proj}/index.html`)
              if (fs.existsSync(indexPath)) {
                res.setHeader('Content-Type', 'text/html; charset=utf-8')
                return res.end(fs.readFileSync(indexPath, 'utf-8'))
              }
            }
          }
          next()
        })
      },
    },
  ],
  server: {
    port: 5176,
  },
})
