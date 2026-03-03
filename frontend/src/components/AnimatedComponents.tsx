import { useEffect, useRef, useState, ReactNode } from 'react'
import { motion, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion'

// ============ SCROLL REVEAL ============
export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}) {
  const initial = {
    up: { opacity: 0, y: 40 },
    down: { opacity: 0, y: -40 },
    left: { opacity: 0, x: -40 },
    right: { opacity: 0, x: 40 },
  }

  return (
    <motion.div
      initial={initial[direction]}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============ STAGGER CHILDREN ============
export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============ COUNT UP ANIMATION ============
export function CountUp({
  end,
  prefix = '',
  suffix = '',
  duration = 2,
  className = '',
}: {
  end: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

// ============ TEXT REVEAL (word by word) ============
export function TextReveal({
  text,
  className = '',
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const words = text.split(' ')

  return (
    <motion.span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

// ============ PARALLAX TILT ============
export function ParallaxTilt({
  children,
  className = '',
  intensity = 10,
}: {
  children: ReactNode
  className?: string
  intensity?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity])

  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 })
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 })

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============ FLOATING ELEMENT ============
export function FloatingElement({
  children,
  className = '',
  delay = 0,
  duration = 6,
  distance = 20,
}: {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
}) {
  return (
    <motion.div
      animate={{
        y: [-distance / 2, distance / 2, -distance / 2],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============ GLOW BUTTON ============
export function GlowButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0"
        animate={{
          boxShadow: [
            '0 0 20px rgba(249,115,22,0.3), 0 0 40px rgba(249,115,22,0.1)',
            '0 0 30px rgba(249,115,22,0.5), 0 0 60px rgba(249,115,22,0.2)',
            '0 0 20px rgba(249,115,22,0.3), 0 0 40px rgba(249,115,22,0.1)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ opacity: 1 }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}

// ============ ANIMATED GRADIENT BORDER ============
export function GradientBorderCard({
  children,
  className = '',
  active = false,
}: {
  children: ReactNode
  className?: string
  active?: boolean
}) {
  return (
    <div className={`relative p-[2px] rounded-2xl ${active ? 'gradient-border' : ''} ${className}`}>
      <div className="bg-[#1a1a1d] rounded-2xl p-6 h-full">
        {children}
      </div>
    </div>
  )
}

// ============ MARQUEE ============
export function Marquee({
  children,
  className = '',
  speed = 30,
}: {
  children: ReactNode
  className?: string
  speed?: number
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        {children}
        {children}
      </div>
    </div>
  )
}

// ============ PAGE TRANSITION WRAPPER ============
export function PageTransition({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
