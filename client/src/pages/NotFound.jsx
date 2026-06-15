import { Link } from 'react-router-dom'
import AuroraBackground from '../components/ui/AuroraBackground.jsx'
import GradientText from '../components/ui/GradientText.jsx'

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center px-6 text-center">
      <AuroraBackground />
      <div>
        <h1 className="font-display text-7xl font-bold sm:text-9xl">
          <GradientText animated>404</GradientText>
        </h1>
        <p className="mt-4 text-lg text-muted">This page drifted off into the aurora.</p>
        <Link to="/" className="btn-primary mt-8 inline-flex">
          Back home
        </Link>
      </div>
    </div>
  )
}
