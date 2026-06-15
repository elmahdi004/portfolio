import PublicLayout from '../components/layout/PublicLayout.jsx'
import Hero from '../sections/Hero.jsx'
import About from '../sections/About.jsx'
import Skills from '../sections/Skills.jsx'
import Projects from '../sections/Projects.jsx'
import Experience from '../sections/Experience.jsx'
import Github from '../sections/Github.jsx'
import Contact from '../sections/Contact.jsx'

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Github />
      <Contact />
    </PublicLayout>
  )
}
