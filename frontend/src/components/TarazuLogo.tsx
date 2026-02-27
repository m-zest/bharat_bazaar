/**
 * TarazuLogo — The Tarazu (तराज़ू) weighing scale logo for BharatBazaar AI
 *
 * Variants:
 *   - NavbarLogo: Compact horizontal for sidebar / top navigation
 *   - FullLogo: Hero sections, about pages, splash screens
 *   - IconLogo: Loading screens, watermarks, social
 *   - WordmarkLogo: Footer, mobile header, watermark
 *   - FaviconLogo: Browser tabs
 *
 * All variants support `mode: 'dark' | 'light'` for background-aware colors.
 */

/* ── Tarazu Scale Icon (shared across variants) ── */

function TarazuIcon({ size = 80, mode = 'dark' }: { size?: number; mode?: 'dark' | 'light' }) {
  const saffron = '#F97316'
  const gold = '#F59E0B'
  const teal = '#0D9488'
  const rupeeFill = mode === 'light' ? '#EA580C' : gold

  // Scale factor relative to 80px base
  const s = size / 80

  return (
    <g transform={`translate(${size / 2}, ${size / 2 + 2 * s}) scale(${s})`}>
      {/* Center post */}
      <line x1="0" y1="-30" x2="0" y2="24" stroke={saffron} strokeWidth="2.5" />
      <polygon points="0,-34 -6,-26 6,-26" fill={saffron} />

      {/* Beam */}
      <line x1="-26" y1="-24" x2="26" y2="-24" stroke={gold} strokeWidth="2" />

      {/* Left pan — ₹ (pricing) */}
      <line x1="-26" y1="-24" x2="-30" y2="-10" stroke={gold} strokeWidth="1.5" />
      <line x1="-26" y1="-24" x2="-22" y2="-10" stroke={gold} strokeWidth="1.5" />
      <path d="M-34,-10 Q-26,-4 -18,-10" stroke={gold} strokeWidth="1.5" fill="none" />
      <text x="-29" y="-12" fontFamily="Sora, sans-serif" fontSize="9" fill={rupeeFill} fontWeight="700">₹</text>

      {/* Right pan — AI nodes (intelligence) */}
      <line x1="26" y1="-24" x2="22" y2="-10" stroke={teal} strokeWidth="1.5" />
      <line x1="26" y1="-24" x2="30" y2="-10" stroke={teal} strokeWidth="1.5" />
      <path d="M18,-10 Q26,-4 34,-10" stroke={teal} strokeWidth="1.5" fill="none" />
      <circle cx="23" cy="-15" r="2.5" fill={teal} />
      <circle cx="29" cy="-15" r="2.5" fill={teal} />
      <circle cx="26" cy="-19" r="2.5" fill={teal} />
      <line x1="23" y1="-15" x2="29" y2="-15" stroke={teal} strokeWidth="0.8" />
      <line x1="26" y1="-19" x2="23" y2="-15" stroke={teal} strokeWidth="0.8" />
      <line x1="26" y1="-19" x2="29" y2="-15" stroke={teal} strokeWidth="0.8" />

      {/* Base */}
      <rect x="-10" y="22" width="20" height="4" rx="2" fill={saffron} opacity="0.5" />
    </g>
  )
}

/* ── Small Tarazu Icon for Navbar ── */

function TarazuIconSmall({ mode = 'dark' }: { mode?: 'dark' | 'light' }) {
  const saffron = '#F97316'
  const gold = '#F59E0B'
  const teal = '#0D9488'
  const rupeeFill = mode === 'light' ? '#EA580C' : gold

  return (
    <g transform="translate(16, 18)">
      <line x1="0" y1="-14" x2="0" y2="12" stroke={saffron} strokeWidth="1.8" />
      <polygon points="0,-16 -4,-12 4,-12" fill={saffron} />
      <line x1="-12" y1="-11" x2="12" y2="-11" stroke={gold} strokeWidth="1.5" />
      <line x1="-12" y1="-11" x2="-14" y2="-4" stroke={gold} strokeWidth="1" />
      <line x1="-12" y1="-11" x2="-10" y2="-4" stroke={gold} strokeWidth="1" />
      <path d="M-16,-4 Q-12,-1 -8,-4" stroke={gold} strokeWidth="1" fill="none" />
      <text x="-14" y="-5" fontFamily="Sora, sans-serif" fontSize="5" fill={rupeeFill} fontWeight="700">₹</text>
      <line x1="12" y1="-11" x2="10" y2="-4" stroke={teal} strokeWidth="1" />
      <line x1="12" y1="-11" x2="14" y2="-4" stroke={teal} strokeWidth="1" />
      <path d="M8,-4 Q12,-1 16,-4" stroke={teal} strokeWidth="1" fill="none" />
      <circle cx="10.5" cy="-7" r="1.2" fill={teal} />
      <circle cx="13.5" cy="-7" r="1.2" fill={teal} />
      <circle cx="12" cy="-9.5" r="1.2" fill={teal} />
      <line x1="10.5" y1="-7" x2="13.5" y2="-7" stroke={teal} strokeWidth="0.5" />
      <line x1="12" y1="-9.5" x2="10.5" y2="-7" stroke={teal} strokeWidth="0.5" />
      <line x1="12" y1="-9.5" x2="13.5" y2="-7" stroke={teal} strokeWidth="0.5" />
      <rect x="-6" y="11" width="12" height="2" rx="1" fill={saffron} opacity="0.4" />
    </g>
  )
}

/* ═══════════════════════════════════════
   EXPORTED COMPONENTS
   ═══════════════════════════════════════ */

interface LogoProps {
  mode?: 'dark' | 'light'
  className?: string
}

/**
 * NavbarLogo — Compact horizontal logo for sidebar and top navigation
 */
export function NavbarLogo({ mode = 'dark', className = '' }: LogoProps) {
  const textColor = mode === 'dark' ? 'white' : '#1a1a1a'
  return (
    <svg width="200" height="36" viewBox="0 0 200 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <TarazuIconSmall mode={mode} />
      <text x="38" y="22" fontFamily="'Outfit', sans-serif" fontWeight="800" fontSize="16" fill={textColor} letterSpacing="-0.5">Bharat</text>
      <text x="99" y="22" fontFamily="'Outfit', sans-serif" fontWeight="300" fontSize="16" fill="#F97316">Bazaar</text>
      <text x="160" y="20" fontFamily="'Outfit', sans-serif" fontWeight="600" fontSize="10" fill="#0D9488">AI</text>
    </svg>
  )
}

/**
 * FullLogo — Primary logo for hero sections, about pages, splash screens
 * Includes tagline and accent bar.
 */
export function FullLogo({ mode = 'dark', className = '' }: LogoProps) {
  const textColor = mode === 'dark' ? 'white' : '#1a1a1a'
  const subtitleColor = mode === 'dark' ? '#555' : '#999'
  return (
    <svg width="380" height="100" viewBox="0 0 380 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g transform="translate(44, 50)">
        <line x1="0" y1="-32" x2="0" y2="28" stroke="#F97316" strokeWidth="2.5" />
        <polygon points="0,-36 -6,-28 6,-28" fill="#F97316" />
        <line x1="-28" y1="-26" x2="28" y2="-26" stroke="#F59E0B" strokeWidth="2" />
        <line x1="-28" y1="-26" x2="-32" y2="-12" stroke="#F59E0B" strokeWidth="1.5" />
        <line x1="-28" y1="-26" x2="-24" y2="-12" stroke="#F59E0B" strokeWidth="1.5" />
        <path d="M-38,-12 Q-28,-6 -18,-12" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
        <text x="-31" y="-14" fontFamily="Sora, sans-serif" fontSize="9" fill="#F59E0B" fontWeight="700">₹</text>
        <line x1="28" y1="-26" x2="24" y2="-12" stroke="#0D9488" strokeWidth="1.5" />
        <line x1="28" y1="-26" x2="32" y2="-12" stroke="#0D9488" strokeWidth="1.5" />
        <path d="M18,-12 Q28,-6 38,-12" stroke="#0D9488" strokeWidth="1.5" fill="none" />
        <circle cx="25" cy="-16" r="2" fill="#0D9488" />
        <circle cx="31" cy="-16" r="2" fill="#0D9488" />
        <circle cx="28" cy="-20" r="2" fill="#0D9488" />
        <line x1="25" y1="-16" x2="31" y2="-16" stroke="#0D9488" strokeWidth="0.8" />
        <line x1="28" y1="-20" x2="25" y2="-16" stroke="#0D9488" strokeWidth="0.8" />
        <line x1="28" y1="-20" x2="31" y2="-16" stroke="#0D9488" strokeWidth="0.8" />
        <rect x="-12" y="26" width="24" height="4" rx="2" fill="#F97316" opacity="0.5" />
      </g>
      <text x="98" y="38" fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="32" fill={textColor} letterSpacing="-1">Bharat</text>
      <text x="222" y="38" fontFamily="'Outfit', sans-serif" fontWeight="300" fontSize="32" fill="#F97316">Bazaar</text>
      <text x="98" y="60" fontFamily="'Sora', sans-serif" fontWeight="400" fontSize="11" fill={subtitleColor} letterSpacing="2">Weighed by Intelligence</text>
      <rect x="98" y="68" width="40" height="3" rx="1.5" fill="#0D9488" />
      <rect x="142" y="68" width="28" height="3" rx="1.5" fill="#F97316" opacity="0.4" />
    </svg>
  )
}

/**
 * IconLogo — Icon-only variant for loading screens, watermarks, social media
 */
export function IconLogo({ mode = 'dark', className = '', size = 80 }: LogoProps & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <TarazuIcon size={size} mode={mode} />
    </svg>
  )
}

/**
 * FaviconLogo — 32x32 with gradient background for browser tabs
 */
export function FaviconLogo({ className = '' }: { className?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="32" height="32" rx="8" fill="url(#fav-grad)" />
      <g transform="translate(16, 17)">
        <line x1="0" y1="-11" x2="0" y2="9" stroke="white" strokeWidth="2" />
        <polygon points="0,-12 -3,-9 3,-9" fill="white" />
        <line x1="-9" y1="-8" x2="9" y2="-8" stroke="white" strokeWidth="1.5" opacity="0.8" />
        <line x1="-9" y1="-8" x2="-11" y2="-3" stroke="white" strokeWidth="1" opacity="0.7" />
        <line x1="-9" y1="-8" x2="-7" y2="-3" stroke="white" strokeWidth="1" opacity="0.7" />
        <path d="M-12,-3 Q-9,-1 -6,-3" stroke="white" strokeWidth="1" fill="none" opacity="0.7" />
        <line x1="9" y1="-8" x2="7" y2="-3" stroke="white" strokeWidth="1" opacity="0.7" />
        <line x1="9" y1="-8" x2="11" y2="-3" stroke="white" strokeWidth="1" opacity="0.7" />
        <path d="M6,-3 Q9,-1 12,-3" stroke="white" strokeWidth="1" fill="none" opacity="0.7" />
        <rect x="-4" y="8" width="8" height="2" rx="1" fill="white" opacity="0.5" />
      </g>
      <defs>
        <linearGradient id="fav-grad" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#F97316" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/**
 * WordmarkLogo — Text-only, no icon. For tight spaces.
 */
export function WordmarkLogo({ mode = 'dark', className = '' }: LogoProps) {
  const textColor = mode === 'dark' ? 'white' : '#1a1a1a'
  return (
    <svg width="200" height="30" viewBox="0 0 200 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <text x="0" y="22" fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="22" fill={textColor} letterSpacing="-1">Bharat</text>
      <text x="76" y="22" fontFamily="'Outfit', sans-serif" fontWeight="300" fontSize="22" fill="#F97316">Bazaar</text>
      <text x="150" y="20" fontFamily="'Outfit', sans-serif" fontWeight="600" fontSize="13" fill="#0D9488">AI</text>
    </svg>
  )
}

/**
 * SidebarLogo — Slightly larger variant with tagline for sidebar header
 */
export function SidebarLogo({ mode = 'dark', className = '' }: LogoProps) {
  const textColor = mode === 'dark' ? 'white' : '#1a1a1a'
  const taglineColor = mode === 'dark' ? 'rgba(255,255,255,0.35)' : '#999'
  return (
    <svg width="180" height="44" viewBox="0 0 180 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <TarazuIconSmall mode={mode} />
      <text x="38" y="20" fontFamily="'Outfit', sans-serif" fontWeight="800" fontSize="16" fill={textColor} letterSpacing="-0.5">Bharat</text>
      <text x="99" y="20" fontFamily="'Outfit', sans-serif" fontWeight="300" fontSize="16" fill="#F97316">Bazaar</text>
      <text x="38" y="35" fontFamily="'Sora', sans-serif" fontWeight="400" fontSize="8" fill={taglineColor} letterSpacing="1.5">Weighed by Intelligence</text>
    </svg>
  )
}
