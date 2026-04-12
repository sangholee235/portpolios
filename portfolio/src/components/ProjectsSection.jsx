import { useEffect, useRef } from 'react'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'

export default function ProjectsSection() {
  const sectionRef = useRef(null)

  // Intersection Observer로 카드 등장 애니메이션
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll('.reveal')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" ref={sectionRef} className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="text-center mb-20 reveal">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
            Projects
          </p>
          <h2 className="text-4xl md:text-5xl font-black gradient-text mb-6">
            진행한 프로젝트
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-base leading-relaxed">
            팀 프로젝트로 개발한 3개의 서비스입니다.
            <br />
            각 프로젝트를 클릭해서 직접 체험해보세요.
          </p>
        </div>

        {/* 프로젝트 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* 하단 안내 */}
        <p className="text-center text-xs text-gray-600 mt-12">
          * 프로젝트 버튼은 로컬 dev 서버 연결 기준입니다. 각 프로젝트를 먼저 실행해주세요.
        </p>
      </div>
    </section>
  )
}
