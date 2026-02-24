import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { MessageSquareText, RotateCcw, Zap, ThumbsUp, ThumbsDown, Minus, AlertTriangle, CheckCircle2, Lightbulb, Globe } from 'lucide-react'
import { api } from '../utils/api'

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
  if (score >= 50) return { emoji: '😊', label: 'Positive', color: 'text-green-500' }
  if (score >= 0) return { emoji: '😐', label: 'Neutral', color: 'text-yellow-500' }
  return { emoji: '😟', label: 'Negative', color: 'text-red-500' }
}

export default function SentimentPage() {
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
      // If user pasted reviews, parse them; otherwise use demo
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
    } catch (err: any) {
      setError(err.message || 'Failed to analyze sentiment')
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
    <div className="p-8 max-w-[1400px]">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-royal-100 flex items-center justify-center">
          <MessageSquareText className="w-6 h-6 text-royal-600" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Sentiment Analyzer</h1>
          <p className="text-sm text-gray-500">Understands Hindi, English & Hinglish reviews</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paste Reviews (one per line)
              </label>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder={'Paste reviews here...\n\nOr click "Load Hinglish Demo" below to see the magic!'}
                className="input-field min-h-[200px] resize-y font-hindi text-sm"
              />
            </div>

            <button
              type="button"
              onClick={loadDemoReviews}
              className="w-full text-sm px-4 py-3 bg-royal-50 border border-royal-200 rounded-xl text-royal-700 hover:bg-royal-100 transition-all font-medium"
            >
              Load 12 Hinglish Demo Reviews
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-royal-500 hover:bg-royal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-royal-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
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
            </button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
            )}
          </div>

          {/* Sample reviews preview */}
          <div className="card bg-gray-50">
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
                <div className="card"><div className="skeleton h-32" /></div>
                <div className="card"><div className="skeleton h-48" /></div>
                <div className="card"><div className="skeleton h-40" /></div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* Overall Sentiment Score */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card text-center"
                >
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
                </motion.div>

                {/* Distribution + Attributes */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Sentiment Distribution Pie */}
                  <div className="card">
                    <h3 className="font-semibold text-gray-900 mb-3">Sentiment Distribution</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={distributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name} ${value}%`}>
                          {distributionData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Product Attributes */}
                  <div className="card">
                    <h3 className="font-semibold text-gray-900 mb-3">Attribute Sentiment</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={attributeData} layout="vertical">
                        <XAxis type="number" domain={[-100, 100]} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={80} className="text-xs" />
                        <Tooltip />
                        <Bar dataKey="sentiment" radius={4}>
                          {attributeData.map((entry: any, i: number) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Key Themes */}
                {result.keyThemes?.length > 0 && (
                  <div className="card">
                    <h3 className="font-semibold text-gray-900 mb-3">Key Themes</h3>
                    <div className="space-y-3">
                      {result.keyThemes.map((theme: any, i: number) => (
                        <motion.div
                          key={theme.theme}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            theme.sentiment >= 30 ? 'bg-green-100 text-green-600' :
                            theme.sentiment >= -30 ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {theme.sentiment >= 30 ? <ThumbsUp className="w-4 h-4" /> :
                             theme.sentiment >= -30 ? <Minus className="w-4 h-4" /> :
                             <ThumbsDown className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900">{theme.theme}</p>
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
                )}

                {/* Actionable Insights */}
                {result.actionableInsights?.length > 0 && (
                  <div className="card">
                    <h3 className="font-semibold text-gray-900 mb-3">Actionable Insights</h3>
                    <div className="space-y-3">
                      {result.actionableInsights.map((insight: any, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 + 0.2 }}
                          className={`p-4 rounded-xl border ${
                            insight.category === 'improvement' ? 'bg-red-50 border-red-200' :
                            insight.category === 'strength' ? 'bg-green-50 border-green-200' :
                            'bg-yellow-50 border-yellow-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {insight.category === 'improvement' ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
                               insight.category === 'strength' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> :
                               <Lightbulb className="w-5 h-5 text-yellow-500" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold uppercase tracking-wider ${
                                  insight.category === 'improvement' ? 'text-red-600' :
                                  insight.category === 'strength' ? 'text-green-600' : 'text-yellow-600'
                                }`}>
                                  {insight.category}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {insight.priority} priority
                                </span>
                                <span className="text-xs text-gray-400">{insight.affectedReviewCount} reviews</span>
                              </div>
                              <p className="text-sm text-gray-700 mt-1">{insight.description}</p>
                              {insight.suggestedAction && (
                                <p className="text-sm font-medium text-gray-900 mt-2">
                                  Action: {insight.suggestedAction}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Language Breakdown */}
                {result.languageBreakdown?.length > 0 && (
                  <div className="card">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-bazaar-500" />
                      Language Breakdown
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {result.languageBreakdown.map((lb: any, i: number) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-xl text-center">
                          <p className="text-sm font-medium text-gray-700">{lb.language}</p>
                          <p className="text-lg font-bold text-gray-900">{lb.reviewCount} reviews</p>
                          <p className={`text-sm font-medium ${lb.avgSentiment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {lb.avgSentiment > 0 ? '+' : ''}{lb.avgSentiment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hinglish Insights */}
                {result.hinglishInsights && (
                  <div className="card bg-gradient-to-r from-royal-50 to-saffron-50 border-royal-200">
                    <p className="text-xs font-bold text-royal-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Hinglish Intelligence
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.hinglishInsights}</p>
                  </div>
                )}
              </motion.div>
            )}

            {!result && !loading && (
              <div className="card text-center py-16 text-gray-400">
                <MessageSquareText className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                <p className="text-lg font-medium">Paste reviews or load the Hinglish demo</p>
                <p className="text-sm mt-2 font-hindi">"Product accha hai but delivery slow thi" — we understand this.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
