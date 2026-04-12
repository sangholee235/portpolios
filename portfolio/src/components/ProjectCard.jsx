export default function ProjectCard({ project, index }) {
  const isEven = index % 2 === 0

  return (
    <div
      className={`reveal delay-${index + 1} group relative rounded-2xl border bg-[#0d0d0f] overflow-hidden transition-all duration-300 ${project.borderColor} ${project.glowClass}`}
    >
      {/* 상단 컬러 바 */}
      <div className={`h-1 w-full bg-gradient-to-r ${project.gradient}`} />

      <div className="p-8">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* 아이콘 영역 */}
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${project.gradientBg} border ${project.borderColor}`}
            >
              {project.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{project.name}</h3>
              <p className="text-sm font-medium mt-0.5" style={{ color: project.color }}>
                {project.tagline}
              </p>
            </div>
          </div>

          {/* 번호 */}
          <span className="text-5xl font-black text-white/5 select-none leading-none">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* 설명 */}
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          {project.description}
        </p>

        {/* 주요 기능 */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
            Key Features
          </p>
          <ul className="space-y-2">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: project.color }} />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* 기술 스택 */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-xs rounded-md border font-medium"
                style={{
                  borderColor: project.color + '44',
                  color: project.color,
                  background: project.colorLight,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* CTA 버튼 */}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group/btn flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] bg-gradient-to-r ${project.gradient} text-white`}
        >
          프로젝트 보러가기
          <span className="transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
        </a>
      </div>
    </div>
  )
}
