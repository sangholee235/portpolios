/**
 * 로컬 개발용 셋업 스크립트
 * 서브 프로젝트만 빌드해서 portfolio/public/ 에 복사합니다.
 * 이후 `npm run dev` 로 포트폴리오를 실행하세요.
 *
 * 실행: npm run dev:setup
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../../')
const PORTFOLIO_PUBLIC = path.resolve(__dirname, '../public')

const subProjects = [
  { name: 'gomin',    dir: path.join(ROOT, 'gomin'),    dest: 'gomin'    },
  { name: 'techmate', dir: path.join(ROOT, 'frontend'), dest: 'techmate' },
  { name: 'cholog',   dir: path.join(ROOT, 'cholog'),   dest: 'cholog'   },
]

function run(cmd, cwd) {
  console.log(`\n▶ ${cmd}  (${path.basename(cwd)})`)
  execSync(cmd, { cwd, stdio: 'inherit' })
}

for (const proj of subProjects) {
  console.log(`\n${'─'.repeat(40)}`)
  console.log(`  ${proj.name} 빌드 중...`)

  run('npm run build', proj.dir)

  const src  = path.join(proj.dir, 'dist')
  const dest = path.join(PORTFOLIO_PUBLIC, proj.dest)
  if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true })
  fs.cpSync(src, dest, { recursive: true })

  console.log(`  ✓ → portfolio/public/${proj.dest}`)
}

console.log('\n✅ 셋업 완료! 이제 npm run dev 를 실행하세요.')
