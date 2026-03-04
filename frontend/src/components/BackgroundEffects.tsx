import { useEffect, useRef } from 'react'

/* ─── Floating Particles (Canvas-based, performant) ─── */
export function FloatingParticles({ count = 40, color = '#F97316' }: { count?: number; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; pulse: number }[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const init = () => {
      resize()
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (time: number) => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.pulse += 0.01

        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = color.replace(')', `, ${a})`).replace('rgb', 'rgba').replace('#F97316', `rgba(249,115,22,${a})`)

        // Parse hex color to rgba
        const hex = color.startsWith('#') ? color : '#F97316'
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.15})`
        ctx.fill()
      }

      // Draw faint connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            const hex = color.startsWith('#') ? color : '#F97316'
            const r = parseInt(hex.slice(1, 3), 16)
            const g = parseInt(hex.slice(3, 5), 16)
            const b = parseInt(hex.slice(5, 7), 16)
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${r},${g},${b},${0.04 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    init()
    animId = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [count, color])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  )
}

/* ─── Animated Gradient Orbs ─── */
export function GradientOrbs({ variant = 'default' }: { variant?: 'default' | 'teal' | 'purple' | 'warm' }) {
  const configs = {
    default: [
      { color: 'rgba(249,115,22,0.08)', size: 600, top: '-10%', left: '60%', delay: '0s' },
      { color: 'rgba(13,148,136,0.06)', size: 500, top: '60%', left: '-5%', delay: '-4s' },
      { color: 'rgba(124,58,237,0.05)', size: 400, top: '30%', left: '80%', delay: '-8s' },
    ],
    teal: [
      { color: 'rgba(13,148,136,0.08)', size: 500, top: '-10%', left: '70%', delay: '0s' },
      { color: 'rgba(249,115,22,0.05)', size: 400, top: '50%', left: '-10%', delay: '-5s' },
    ],
    purple: [
      { color: 'rgba(124,58,237,0.08)', size: 500, top: '-10%', left: '20%', delay: '0s' },
      { color: 'rgba(249,115,22,0.06)', size: 400, top: '60%', left: '70%', delay: '-6s' },
    ],
    warm: [
      { color: 'rgba(249,115,22,0.1)', size: 600, top: '20%', left: '50%', delay: '0s' },
      { color: 'rgba(245,158,11,0.07)', size: 450, top: '-10%', left: '-5%', delay: '-3s' },
      { color: 'rgba(13,148,136,0.05)', size: 350, top: '70%', left: '80%', delay: '-7s' },
    ],
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {configs[variant].map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-orb-drift"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(80px)',
            animationDelay: orb.delay,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Dot Grid Pattern ─── */
export function DotGrid({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }}
    />
  )
}

/* ─── Noise Texture Overlay ─── */
export function NoiseOverlay({ opacity = 0.02 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }}
    />
  )
}

/* ─── Animated Grid Lines ─── */
export function AnimatedGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Horizontal scan line */}
      <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent animate-scan-h" />
      {/* Vertical scan line */}
      <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-teal-500/15 to-transparent animate-scan-v" />
      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.03,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}

/* ─── Radial Glow (for section accents) ─── */
export function RadialGlow({
  color = 'rgba(249,115,22,0.08)',
  position = 'center',
  size = 600,
}: {
  color?: string
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  size?: number
}) {
  const posMap = {
    center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    'top-left': { top: '-10%', left: '-10%' },
    'top-right': { top: '-10%', right: '-10%' },
    'bottom-left': { bottom: '-10%', left: '-10%' },
    'bottom-right': { bottom: '-10%', right: '-10%' },
  }

  return (
    <div
      className="absolute pointer-events-none rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(60px)',
        ...posMap[position],
      }}
    />
  )
}
