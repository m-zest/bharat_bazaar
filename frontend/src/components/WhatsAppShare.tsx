import { motion } from 'framer-motion'
import { Share2 } from 'lucide-react'

interface WhatsAppShareProps {
  text: string
  label?: string
  compact?: boolean
}

export default function WhatsAppShare({ text, label = 'WhatsApp', compact = false }: WhatsAppShareProps) {
  function handleShare() {
    const encoded = encodeURIComponent(text)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  if (compact) {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleShare}
        className="p-2 hover:bg-green-500/10 rounded-lg transition-all"
        title="Share on WhatsApp"
      >
        <Share2 className="w-4 h-4 text-green-500" />
      </motion.button>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/25 font-medium"
    >
      <Share2 className="w-4 h-4" />
      {label}
    </motion.button>
  )
}
