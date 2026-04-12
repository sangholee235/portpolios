export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-white font-semibold text-sm">Portfolio</p>
          <p className="text-gray-600 text-xs mt-1">Built with React + Tailwind CSS</p>
        </div>
        <p className="text-gray-700 text-xs">© {year} All rights reserved.</p>
      </div>
    </footer>
  )
}
