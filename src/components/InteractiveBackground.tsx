import React, { useEffect, useRef, useState } from "react"
import { Icon } from "@iconify/react"
import config from "../data/travel.config.json"

type Motif = {
  id: number
  x: number
  y: number
  icon: string
  size: number
  rotation: number
  speed: number
  color: string
}

const bgConfig = config.interactiveBackground || {}

const ICONS = bgConfig.icons || []

const HANZI = bgConfig.hanzi || []

const COLORS = bgConfig.colors || [
  "#ef4444",
  "#f59e0b",
  "#eab308",
  "#dc2626",
  "#fbbf24",
]

export default function InteractiveBackground() {
  const [motifs, setMotifs] = useState<Motif[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Initialize random motifs
    const count = bgConfig.count || 20
    const newMotifs: Motif[] = []
    for (let i = 0; i < count; i++) {
      const sizeMin = bgConfig.sizeMin || 30
      const sizeMax = bgConfig.sizeMax || 70
      const speedMin = bgConfig.speedMin || 0.1
      const speedMax = bgConfig.speedMax || 0.4

      newMotifs.push({
        id: i,
        x: Math.random() * 100, // %
        y: Math.random() * 100, // %
        icon:
          Math.random() > 0.4
            ? ICONS[Math.floor(Math.random() * ICONS.length)]
            : HANZI[Math.floor(Math.random() * HANZI.length)],
        size: Math.random() * (sizeMax - sizeMin) + sizeMin,
        rotation: Math.random() * 360,
        speed: Math.random() * (speedMax - speedMin) + speedMin,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
    }
    setMotifs(newMotifs)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {motifs.map((motif) => (
        <FloatingElement key={motif.id} motif={motif} mouseRef={mouseRef} />
      ))}
      {/* Gradient overlay to ensure text readability */}
      <div className="absolute inset-0 bg-linear-to-b from-obsidian-900/60 via-transparent to-obsidian-900/60 pointer-events-none" />
    </div>
  )
}

function FloatingElement({
  motif,
  mouseRef,
}: {
  motif: Motif
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number

    const animate = () => {
      if (!ref.current) return

      // Get current pixel position
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Calculate distance to mouse
      const dx = centerX - mouseRef.current.x
      const dy = centerY - mouseRef.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      // Repulsion effect (stronger)
      const maxDist = bgConfig.maxDist || 400
      let moveX = 0
      let moveY = 0

      if (dist < maxDist) {
        const force = (maxDist - dist) / maxDist
        const angle = Math.atan2(dy, dx)
        const repulsionForce = bgConfig.repulsionForce || 50
        moveX = Math.cos(angle) * force * repulsionForce
        moveY = Math.sin(angle) * force * repulsionForce
      }

      // Continuous drift effect (stronger)
      const time = Date.now() * 0.001
      const driftAmplitude = bgConfig.driftAmplitude || 30
      const driftX = Math.sin(time * motif.speed + motif.id) * driftAmplitude
      const driftY =
        Math.cos(time * motif.speed * 0.8 + motif.id) * driftAmplitude

      // Rotation animation
      const rotationSpeed = bgConfig.rotationSpeed || 0.2
      const currentRotation = (time * rotationSpeed * 10 + motif.rotation) % 360

      ref.current.style.transform = `translate(${moveX + driftX}px, ${
        moveY + driftY
      }px) rotate(${currentRotation}deg)`

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [motif])

  const isHanzi = !motif.icon.startsWith("mdi:")

  const opacity = bgConfig.opacity || 0.3

  return (
    <div
      ref={ref}
      className="absolute transition-opacity duration-1000 ease-in-out"
      style={{
        left: `${motif.x}%`,
        top: `${motif.y}%`,
        fontSize: `${motif.size}px`,
        color: motif.color,
        opacity: opacity,
      }}
    >
      {isHanzi ? (
        <span className="font-serif font-bold select-none drop-shadow-lg">
          {motif.icon}
        </span>
      ) : (
        <Icon
          icon={motif.icon}
          width={motif.size}
          height={motif.size}
          className="drop-shadow-lg"
        />
      )}
    </div>
  )
}
