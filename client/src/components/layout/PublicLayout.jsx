import AuroraBackground from '../ui/AuroraBackground.jsx'
import ScrollProgress from '../ui/ScrollProgress.jsx'
import CustomCursor from '../ui/CustomCursor.jsx'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import CommandPalette from '../CommandPalette.jsx'
import AIAssistant from '../AIAssistant.jsx'

export default function PublicLayout({ children }) {
  return (
    <div id="top" className="relative min-h-screen">
      <AuroraBackground />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CommandPalette />
      <AIAssistant />
    </div>
  )
}
