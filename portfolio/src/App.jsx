import Hero from './components/Hero'
import ProjectsSection from './components/ProjectsSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="bg-[#070709] min-h-screen text-white">
      <Hero />
      <ProjectsSection />
      <Footer />
    </div>
  )
}
