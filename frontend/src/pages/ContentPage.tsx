import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Languages, Copy, Check, RotateCcw, Zap, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { api } from '../utils/api'

const DEMO_PRODUCTS = [
  {
    name: 'Premium Basmati Rice 5kg',
    category: 'Groceries',
    features: ['Aged 2 years', 'Extra-long grain', 'Aromatic', 'Pesticide-free', 'From Dehradun valley'],
    specifications: { weight: '5kg', grain_length: '8.4mm', aging: '2 years', origin: 'Dehradun, Uttarakhand' },
  },
  {
    name: 'Handloom Cotton Kurta - Men',
    category: 'Fashion',
    features: ['Pure cotton handloom', 'Chikankari embroidery', 'Comfortable fit', 'Machine washable', 'Available in 5 colors'],
    specifications: { fabric: '100% Cotton', type: 'Chikankari', sizes: 'S, M, L, XL, XXL', origin: 'Lucknow' },
  },
]

const LANGUAGES = [
  { code: 'en', name: 'English', nameNative: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nameNative: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nameNative: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nameNative: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nameNative: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nameNative: 'मराठी', flag: '🇮🇳' },
]

export default function ContentPage() {
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('Groceries')
  const [features, setFeatures] = useState('')
  const [selectedLangs, setSelectedLangs] = useState<string[]>(['en', 'hi'])
  const [tone, setTone] = useState('persuasive')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0)

  function loadDemo(demo: typeof DEMO_PRODUCTS[0]) {
    setProductName(demo.name)
    setCategory(demo.category)
    setFeatures(demo.features.join(', '))
    setResult(null)
  }

  function toggleLang(code: string) {
    setSelectedLangs(prev =>
      prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]
    )
  }

  async function handleCopy(text: string, idx: number) {
    await navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selectedLangs.length === 0) {
      setError('Select at least one language')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const data = await api.generateDescription({
        productName,
        category,
        features: features.split(',').map(f => f.trim()).filter(Boolean),
        specifications: {},
        targetLanguages: selectedLangs,
        tone,
      })
      setResult(data)
      setExpandedIdx(0)
    } catch (err: any) {
      setError(err.message || 'Failed to generate descriptions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-[1400px]">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-bazaar-100 flex items-center justify-center">
          <Languages className="w-6 h-6 text-bazaar-600" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Multilingual Content Generator</h1>
          <p className="text-sm text-gray-500">Culturally adapted descriptions — not just translations</p>
        </div>
      </div>

      {/* Demo Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-sm text-gray-500 py-2">Quick Demo:</span>
        {DEMO_PRODUCTS.map(demo => (
          <button
            key={demo.name}
            onClick={() => loadDemo(demo)}
            className="text-sm px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-bazaar-300 hover:bg-bazaar-50 transition-all"
          >
            {demo.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="e.g., Premium Basmati Rice 5kg"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="input-field">
              {['Electronics', 'Fashion', 'Groceries', 'Home & Kitchen', 'Beauty & Personal Care'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key Features (comma separated)</label>
            <textarea
              value={features}
              onChange={e => setFeatures(e.target.value)}
              placeholder="Aged 2 years, Extra-long grain, Aromatic..."
              className="input-field min-h-[80px] resize-y"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
            <select value={tone} onChange={e => setTone(e.target.value)} className="input-field">
              <option value="persuasive">Persuasive (Marketing)</option>
              <option value="formal">Formal (Professional)</option>
              <option value="casual">Casual (Friendly)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Languages</label>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => toggleLang(lang.code)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                    selectedLangs.includes(lang.code)
                      ? 'border-bazaar-400 bg-bazaar-50 text-bazaar-700 font-medium'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  <span className="text-xs opacity-60">{lang.nameNative}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Generating in {selectedLangs.length} languages...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate Descriptions
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
          )}
        </form>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {selectedLangs.map((_, i) => (
                  <div key={i} className="card">
                    <div className="skeleton h-6 w-24 mb-3" />
                    <div className="skeleton h-4 w-full mb-2" />
                    <div className="skeleton h-4 w-full mb-2" />
                    <div className="skeleton h-4 w-3/4 mb-4" />
                    <div className="space-y-2">
                      {[1,2,3].map(j => <div key={j} className="skeleton h-4 w-5/6" />)}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {result && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {result.descriptions?.map((desc: any, i: number) => {
                  const isExpanded = expandedIdx === i
                  const fullText = `${desc.title}\n\n${desc.description}\n\n${desc.bulletPoints?.map((b: string) => `• ${b}`).join('\n')}`

                  return (
                    <motion.div
                      key={desc.language}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="card border border-gray-200 overflow-hidden"
                    >
                      {/* Language Header */}
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedIdx(isExpanded ? null : i)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{LANGUAGES.find(l => l.code === desc.language)?.flag || '🌐'}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{desc.languageName}</h3>
                            <p className="text-xs text-gray-400">{desc.language.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCopy(fullText, i) }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            title="Copy to clipboard"
                          >
                            {copiedIdx === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                          </button>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              {/* Title */}
                              <h4 className={`text-lg font-bold text-gray-900 mb-3 ${['hi', 'mr'].includes(desc.language) ? 'font-hindi' : ''}`}>
                                {desc.title}
                              </h4>

                              {/* Description */}
                              <p className={`text-gray-600 leading-relaxed whitespace-pre-wrap mb-4 ${['hi', 'mr'].includes(desc.language) ? 'font-hindi' : ''}`}>
                                {desc.description}
                              </p>

                              {/* Bullet Points */}
                              {desc.bulletPoints?.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Selling Points</p>
                                  <ul className={`space-y-1 ${['hi', 'mr'].includes(desc.language) ? 'font-hindi' : ''}`}>
                                    {desc.bulletPoints.map((bp: string, j: number) => (
                                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-bazaar-500 mt-0.5">•</span>
                                        {bp}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Cultural Notes */}
                              {desc.culturalNotes && (
                                <div className="p-3 bg-saffron-50 rounded-lg mb-3">
                                  <p className="text-xs font-semibold text-saffron-600 uppercase tracking-wider">Cultural Adaptation</p>
                                  <p className="text-sm text-saffron-700 mt-1">{desc.culturalNotes}</p>
                                </div>
                              )}

                              {/* SEO Keywords */}
                              {desc.localSearchTerms?.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Search className="w-3 h-3" /> SEO Keywords
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {desc.localSearchTerms.map((kw: string, j: number) => (
                                      <span key={j} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">{kw}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {!result && !loading && (
              <div className="card text-center py-16 text-gray-400">
                <Languages className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                <p className="text-lg font-medium">Generate multilingual product descriptions</p>
                <p className="text-sm mt-2">Click a "Quick Demo" button to try with a pre-loaded product</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
