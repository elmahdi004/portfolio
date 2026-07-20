import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Icosahedron, MeshDistortMaterial, Stars } from '@react-three/drei'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

// A glowing, distorting crystal that gently reacts to the cursor.
function Crystal() {
  const group = useRef()
  const shell = useRef()

  useFrame((state) => {
    const { pointer } = state
    if (group.current) {
      group.current.rotation.y += (pointer.x * 0.6 - group.current.rotation.y) * 0.05
      group.current.rotation.x += (-pointer.y * 0.4 - group.current.rotation.x) * 0.05
    }
    if (shell.current) {
      shell.current.rotation.x += 0.0016
      shell.current.rotation.y += 0.0022
    }
  })

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1.3}>
        <Icosahedron args={[1.25, 8]}>
          <MeshDistortMaterial
            color="#0d9488"
            emissive="#10b981"
            emissiveIntensity={0.3}
            distort={0.38}
            speed={2.2}
            roughness={0.12}
            metalness={0.9}
          />
        </Icosahedron>
        <Icosahedron ref={shell} args={[1.75, 1]}>
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.22} />
        </Icosahedron>
      </Float>
    </group>
  )
}

// CSS-only fallback for environments without WebGL.
function FallbackOrb() {
  return (
    <div className="grid aspect-square w-full max-w-md place-items-center">
      <div
        className="h-3/5 w-3/5 animate-float-slow rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, #34d399, #22d3ee, #818cf8, #34d399)',
          filter: 'blur(2px)',
          boxShadow: '0 0 90px rgb(var(--primary) / 0.5)',
        }}
      />
    </div>
  )
}

export default function Hero3D() {
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [webgl] = useState(hasWebGL)

  if (!webgl) {
    return (
      <div className="relative mx-auto aspect-square w-full max-w-md">
        <FallbackOrb />
      </div>
    )
  }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div
        className="absolute inset-8 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgb(var(--primary) / 0.55), transparent 70%)' }}
      />
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        frameloop={reduce ? 'demand' : 'always'}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={70} color="#34d399" />
        <pointLight position={[-5, -3, 2]} intensity={55} color="#818cf8" />
        <pointLight position={[0, 3, -4]} intensity={45} color="#22d3ee" />
        <Suspense fallback={null}>
          <Crystal />
          <Stars radius={9} depth={20} count={reduce ? 350 : 1200} factor={3} saturation={0} fade speed={1} />
        </Suspense>
      </Canvas>
    </div>
  )
}
