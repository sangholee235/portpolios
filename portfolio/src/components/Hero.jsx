import { useEffect, useRef } from 'react'

export default function Hero() {
  const heroRef = useRef(null)

  // 마우스 움직임에 따라 빛 효과
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      hero.style.setProperty('--mouse-x', `${x}%`)
      hero.style.setProperty('--mouse-y', `${y}%`)
    }
    hero.addEventListener('mousemove', handleMouseMove)
    return () => hero.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden dot-grid"
      style={{
        background:
          'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 40%), #1a1a2e 0%, #070709 60%)',
      }}
    >
      {/* 배경 글로우 블롭 */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-[120px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 pointer-events-none" />

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 text-center max-w-4xl w-full">
        {/* 배지 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-gray-400 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Frontend Developer · React
        </div>

        {/* 타이틀 */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 animate-fade-in-up"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <span className="gradient-text">안녕하세요,</span>
          <br />
          <span className="gradient-text">반갑습니다 👋</span>
        </h1>

        {/* 서브타이틀 */}
        <p
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
        >
          React · TypeScript · Redux를 주로 사용하는 프론트엔드 개발자입니다.
          <br className="hidden md:block" />
          사용자 경험과 코드 품질 모두를 중요하게 생각합니다.
        </p>

        {/* 기술 뱃지 */}
        <div
          className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in-up"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          {['React', 'TypeScript', 'Redux', 'Tailwind CSS', 'Vite', 'Firebase'].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
        >
          <a
            href="#projects"
            className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-semibold text-base hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02]"
          >
            프로젝트 보기
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-float">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-gray-600 to-transparent" />
      </div>
    </section>
  )
}
