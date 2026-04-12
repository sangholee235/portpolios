/**
 * 전체 빌드 스크립트
 * 3개 서브 프로젝트를 빌드하고 portfolio/public/ 에 복사한 뒤
 * 포트폴리오 자체를 빌드합니다.
 *
 * 실행: node scripts/build-all.mjs  (or npm run build:all)
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../../')         // fronts/
const PORTFOLIO_PUBLIC = path.resolve(__dirname, '../public')

const subProjects = [
  { name: 'gomin',    dir: path.join(ROOT, 'gomin'),    dest: 'gomin',    env: { VITE_API_BASE_URL: '' } },
  { name: 'techmate', dir: path.join(ROOT, 'frontend'), dest: 'techmate', env: { VITE_API_BASE_URL: '' } },
  { name: 'cholog',   dir: path.join(ROOT, 'cholog'),   dest: 'cholog',   env: { VITE_API_BASE_URL: 'https://www.cholog.com' } },
]

function run(cmd, cwd, extraEnv = {}) {
  console.log(`\n▶ ${cmd}  (in ${path.basename(cwd)})`)
  execSync(cmd, { cwd, stdio: 'inherit', env: { ...process.env, ...extraEnv } })
}

function copyDir(src, dest) {
  if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true })
  fs.cpSync(src, dest, { recursive: true })
}

// 1. 서브 프로젝트 빌드 & 복사
for (const proj of subProjects) {
  console.log(`\n${'='.repeat(50)}`)
  console.log(`  Building: ${proj.name}`)
  console.log('='.repeat(50))

  run('npm run build', proj.dir, proj.env)

  const distDir  = path.join(proj.dir, 'dist')
  const destDir  = path.join(PORTFOLIO_PUBLIC, proj.dest)

  console.log(`  Copying ${proj.name}/dist → portfolio/public/${proj.dest}`)
  copyDir(distDir, destDir)
}

// 2. 포트폴리오 빌드
console.log(`\n${'='.repeat(50)}`)
console.log('  Building: portfolio')
console.log('='.repeat(50))

const portfolioDir = path.resolve(__dirname, '..')
run('npm run build', portfolioDir)

console.log('\n✅ All done! Deploy the portfolio/dist/ folder.')
