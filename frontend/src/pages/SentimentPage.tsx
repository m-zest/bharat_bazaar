import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { MessageSquareText, RotateCcw, Zap, ThumbsUp, ThumbsDown, Minus, AlertTriangle, CheckCircle2, Lightbulb, Globe } from 'lucide-react'
import { api } from '../utils/api'
import { ScrollReveal } from '../components/AnimatedComponents'
import DemoModeBadge from '../components/DemoModeBadge'
import { useToast } from '../components/Toast'

const SAMPLE_REVIEWS = [
  'Product accha hai but delivery bahut slow thi. 5 din lag gaye aane mein.',
  'पैकेजिंग टूटी हुई थी, rice spill ho gaya bag mein. Not happy with this.',
  'Bahut badhiya quality! Biryani mein use kiya, aroma zabardast tha.',
  'Price thoda zyada hai compared to local market, but quality is genuinely better.',
  'Excellent basmati rice. The grains are long and separate after cooking.',
  'Average quality. Mere yahan ki local dukaan pe same price mein better milta hai.',
  'Maine 3 baar order kiya hai, har baar consistent quality.',
  'Rice is ok ok, nothing special. Regular chawal jaisa hi hai.',
  'Good quality rice but quantity kam laga. 5kg likha tha, weigh kiya toh 4.7kg nikla.',
  'Festival season mein gift kiya tha relatives ko. Sabne pucha kahan se liya!',
  'Not worth the price. Mujhe lagta hai ye 2 saal aged nahi hai.',
  'Love it! The fragrance when cooking is amazing. My mother-in-law was very impressed.',
]

const SENTIMENT_COLORS = {
  positive: '#10b981',
  neutral: '#f59e0b',
  negative: '#ef4444',
}

function getSentimentEmoji(score: number) {
  if (score >= 50) return { emoji: '😊', label: 'Positive', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' }
  if (score >= 0) return { emoji: '😐', label: 'Neutral', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' }
  return { emoji: '😟', label: 'Negative', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' }
}

export default function SentimentPage() {
  const { toast } = useToast()
  const [productName, setProductName] = useState('Premium Basmati Rice 5kg')
  const [reviewText, setReviewText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  function loadDemoReviews() {
    setReviewText(SAMPLE_REVIEWS.join('\n\n'))
    setResult(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      let reviews;
      if (reviewText.trim()) {
        reviews = reviewText.split('\n').filter(l => l.trim()).map((text, i) => ({
          reviewId: `r${i + 1}`,
          text: text.trim(),
          date: new Date().toISOString().split('T')[0],
        }))
      }

      const data = await api.analyzeSentiment({
        productName,
        reviews,
        useDemo: !reviewText.trim(),
      })
      setResult(data)
      if (data.demoMode) toast('info', 'AI demo mode — smart fallback data')
      else toast('success', `${data.reviewCount || 0} reviews analyzed!`)
    } catch (err: any) {
      setError(err.message || 'Failed to analyze sentiment')
      toast('error', 'AI temporarily unavailable. Try again shortly.')
    } finally {
      setLoading(false)
    }
  }

  const sentiment = result?.overallSentiment
  const sentimentInfo = sentiment ? getSentimentEmoji(sentiment.score) : null

  const distributionData = sentiment ? [
    { name: 'Positive', value: sentiment.distribution.positive, color: SENTIMENT_COLORS.positive },
    { name: 'Neutral', value: sentiment.distribution.neutral, color: SENTIMENT_COLORS.neutral },
    { name: 'Negative', value: sentiment.distribution.negative, color: SENTIMENT_COLORS.negative },
  ] : []

  const attributeData = result?.productAttributes?.map((a: any) => ({
    name: a.attribute,
    sentiment: a.sentiment,
    mentions: a.mentionCount,
    fill: a.sentiment >= 0 ? '#10b981' : '#ef4444',
  })) || []

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      {/* Page Header */}
      <div className="page-header rounded-2xl mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-400 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <MessageSquareText className="w-6 h-6 text-violet-300" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Sentiment Analyzer</h1>
            <p className="text-sm text-white/60">Understands Hindi, English & Hinglish reviews</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div className="bg-[#1a1a1d] rounded-2xl p-6 shadow-sm shadow-black/20 border border-[#2a2a2d] space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Paste Reviews (one per line)
              </label>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder={'Paste reviews here...\n\nOr click "Load Hinglish Demo" below to see the magic!'}
                className="input-field min-h-[200px] resize-y font-hindi text-sm"
              />
            </div>

            <motion.button
              type="button"
              onClick={loadDemoReviews}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full text-sm px-4 py-3 bg-royal-500/10 border border-royal-500/20 rounded-xl text-royal-400 hover:bg-royal-500/15 transition-all font-medium"
            >
              Load 12 Hinglish Demo Reviews
            </motion.button>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full bg-gradient-to-r from-royal-500 to-violet-600 hover:from-royal-600 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-royal-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Analyzing {reviewText ? 'your' : '12 demo'} reviews...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Analyze Sentiment
                </>
              )}
            </motion.button>

            {error && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-400">
                AI features temporarily limited. Our servers are experiencing high demand. Please try again in a few minutes.
              </div>
            )}
          </div>

          {/* Sample reviews preview */}
          <div className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm shadow-black/20 border border-[#2a2a2d]">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sample Hinglish Reviews</p>
            <div className="space-y-2">
              {SAMPLE_REVIEWS.slice(0, 4).map((r, i) => (
                <p key={i} className="text-xs text-gray-500 font-hindi leading-relaxed">"{r}"</p>
              ))}
              <p className="text-xs text-gray-400">...and 8 more</p>
            </div>
          </div>
        </form>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="bg-[#1a1a1d] rounded-2xl p-6 shadow-sm shadow-black/20 border border-[#2a2a2d]"><div className="skeleton h-32 rounded-xl" /></div>
                <div className="bg-[#1a1a1d] rounded-2xl p-6 shadow-sm shadow-black/20 border border-[#2a2a2d]"><div className="skeleton h-48 rounded-xl" /></div>
                <div className="bg-[#1a1a1d] rounded-2xl p-6 shadow-sm shadow-black/20 border border-[#2a2a2d]"><div className="skeleton h-40 rounded-xl" /></div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* Overall Sentiment Score */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-[#1a1a1d] rounded-2xl p-6 shadow-sm shadow-black/20 border ${sentimentInfo?.border} text-center relative overflow-hidden`}
                >
                  <div className={`absolute inset-0 ${sentimentInfo?.bg} opacity-30`} />
                  <div className="relative z-10">
                    <p className="text-sm text-gray-500 mb-2">Overall Sentiment</p>
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-5xl">{sentimentInfo?.emoji}</span>
                      <div>
                        <p className={`text-5xl font-display font-extrabold ${sentimentInfo?.color}`}>
                          {sentiment.score > 0 ? '+' : ''}{sentiment.score}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{sentimentInfo?.label} — {result.reviewCount} reviews analyzed</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Distribution + Attributes */}
                <div className="grid md:grid-cols-2 gap-4">
                  <ScrollReveal delay={0.1}>
                    <div className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm shadow-black/20 border border-[#2a2a2d]">
                      <h3 className="font-semibold text-gray-100 mb-3 text-sm">Sentiment Distribution</h3>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie data={distributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={70} strokeWidth={2} stroke="#1a1a1d" label={({ name, value }) => `${name} ${value}%`}>
                            {distributionData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', background: '#1a1a1d', color: '#e5e7eb', border: '1px solid #2a2a2d', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={0.15}>
                    <div className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm shadow-black/20 border border-[#2a2a2d]">
                      <h3 className="font-semibold text-gray-100 mb-3 text-sm">Attribute Sentiment</h3>
                      <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={attributeData} layout="vertical">
                          <XAxis type="number" domain={[-100, 100]} axisLine={false} tickLine={false} />
                          <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={80} className="text-xs" />
                          <Tooltip contentStyle={{ borderRadius: '12px', background: '#1a1a1d', color: '#e5e7eb', border: '1px solid #2a2a2d', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }} />
                          <Bar dataKey="sentiment" radius={4}>
                            {attributeData.map((entry: any, i: number) => (
                              <Cell key={i} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Key Themes */}
                {result.keyThemes?.length > 0 && (
                  <ScrollReveal>
                    <div className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm shadow-black/20 border border-[#2a2a2d]">
                      <h3 className="font-semibold text-gray-100 mb-3 text-sm">Key Themes</h3>
                      <div className="space-y-2">
                        {result.keyThemes.map((theme: any, i: number) => (
                          <motion.div
                            key={theme.theme}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            whileHover={{ x: 4 }}
                            className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-xl hover:bg-white/[0.06] transition-colors"
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              theme.sentiment >= 30 ? 'bg-green-500/15 text-green-400' :
                              theme.sentiment >= -30 ? 'bg-yellow-500/15 text-yellow-400' :
                              'bg-red-500/15 text-red-400'
                            }`}>
                              {theme.sentiment >= 30 ? <ThumbsUp className="w-4 h-4" /> :
                               theme.sentiment >= -30 ? <Minus className="w-4 h-4" /> :
                               <ThumbsDown className="w-4 h-4" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-100 text-sm">{theme.theme}</p>
                                <span className="text-xs text-gray-400">{theme.frequency} mentions</span>
                              </div>
                              {theme.exampleReviews?.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1 font-hindi italic">"{theme.exampleReviews[0]}"</p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* Actionable Insights */}
                {result.actionableInsights?.length > 0 && (
                  <ScrollReveal>
                    <div className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm shadow-black/20 border border-[#2a2a2d]">
                      <h3 className="font-semibold text-gray-100 mb-3 text-sm">Actionable Insights</h3>
                      <div className="space-y-3">
                        {result.actionableInsights.map((insight: any, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`p-4 rounded-xl border ${
                              insight.category === 'improvement' ? 'bg-red-500/10 border-red-500/20' :
                              insight.category === 'strength' ? 'bg-green-500/10 border-green-500/20' :
                              'bg-yellow-500/10 border-yellow-500/20'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                {insight.category === 'improvement' ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
                                 insight.category === 'strength' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> :
                                 <Lightbulb className="w-5 h-5 text-yellow-500" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                    insight.category === 'improvement' ? 'text-red-400' :
                                    insight.category === 'strength' ? 'text-green-400' : 'text-yellow-400'
                                  }`}>
                                    {insight.category}
                                  </span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                    insight.priority === 'high' ? 'bg-red-500/15 text-red-400' :
                                    insight.priority === 'medium' ? 'bg-yellow-500/15 text-yellow-400' :
                                    'bg-white/[0.03] text-gray-400'
                                  }`}>
                                    {insight.priority} priority
                                  </span>
                                  <span className="text-[10px] text-gray-400">{insight.affectedReviewCount} reviews</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1">{insight.description}</p>
                                {insight.suggestedAction && (
                                  <p className="text-sm font-medium text-gray-100 mt-2">
                                    Action: {insight.suggestedAction}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* Language Breakdown */}
                {result.languageBreakdown?.length > 0 && (
                  <ScrollReveal>
                    <div className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm shadow-black/20 border border-[#2a2a2d]">
                      <h3 className="font-semibold text-gray-100 mb-3 flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-bazaar-500" />
                        Language Breakdown
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {result.languageBreakdown.map((lb: any, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.08 }}
                            className="p-3 bg-white/[0.03] rounded-xl text-center"
                          >
                            <p className="text-sm font-medium text-gray-300">{lb.language}</p>
                            <p className="text-lg font-bold text-gray-100">{lb.reviewCount} reviews</p>
                            <p className={`text-sm font-medium ${lb.avgSentiment >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {lb.avgSentiment > 0 ? '+' : ''}{lb.avgSentiment}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* Hinglish Insights */}
                {result.hinglishInsights && (
                  <ScrollReveal>
                    <div className="bg-gradient-to-r from-royal-500/10 to-saffron-500/10 rounded-2xl p-5 border border-royal-500/20">
                      <p className="text-xs font-bold text-royal-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Hinglish Intelligence
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed">{result.hinglishInsights}</p>
                    </div>
                  </ScrollReveal>
                )}
              </motion.div>
            )}

            {!result && !loading && (
              <div className="bg-[#1a1a1d] rounded-2xl shadow-sm shadow-black/20 border border-[#2a2a2d] text-center py-16 text-gray-400">
                <MessageSquareText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-lg font-medium">Paste reviews or load the Hinglish demo</p>
                <p className="text-sm mt-2 font-hindi">"Product accha hai but delivery slow thi" — we understand this.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <DemoModeBadge visible={!!result?.demoMode} />
    </div>
  )
}
