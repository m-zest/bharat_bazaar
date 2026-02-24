import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Store, IndianRupee, Languages, MessageSquareText, ArrowRight, Sparkles, MapPin, TrendingUp, Zap } from 'lucide-react'

const features = [
  {
    icon: IndianRupee,
    title: 'Smart Pricing Engine',
    titleHi: 'स्मार्ट प्राइसिंग इंजन',
    description: 'AI-powered pricing that understands Mumbai vs Lucknow economics. Get 3 strategies with profit impact analysis.',
    color: 'saffron',
  },
  {
    icon: Languages,
    title: 'Multilingual Content',
    titleHi: 'बहुभाषी कंटेंट जेनरेटर',
    description: 'Not just translation — culturally adapted product descriptions in Hindi, Tamil, Bengali, Gujarati, Marathi & English.',
    color: 'bazaar',
  },
  {
    icon: MessageSquareText,
    title: 'Sentiment Analyzer',
    titleHi: 'सेंटिमेंट एनालाइज़र',
    description: 'Understands Hinglish reviews like "Product accha hai but delivery slow thi." Real Indian language intelligence.',
    color: 'royal',
  },
]

const stats = [
  { value: '12M+', label: 'Small Retailers in India' },
  { value: '₹50K+', label: 'Lost Yearly to Bad Pricing' },
  { value: '70%', label: 'Prefer Regional Languages' },
  { value: '₹999', label: '/month — Affordable for All' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl gradient-text">BharatBazaar AI</h1>
              <p className="text-[10px] text-gray-400 tracking-wider uppercase">by ParityAI</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block font-hindi">भारत के लिए AI</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              Try Live Demo <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-saffron-50 text-saffron-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Powered by Amazon Bedrock (Claude AI)
            </div>

            <h2 className="font-display text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              AI-Powered Market
              <br />
              Intelligence for{' '}
              <span className="gradient-text">Bharat</span>
            </h2>

            <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              12 million small retailers make pricing decisions on gut feeling.
              BharatBazaar AI gives every kirana store the same intelligence as Amazon's data team —
              in their own language.
            </p>

            <p className="mt-3 text-lg font-hindi text-saffron-500">
              हर दुकानदार के लिए AI की ताक़त
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary text-lg px-8 py-4 flex items-center gap-3"
              >
                <Zap className="w-5 h-5" />
                Try Live Demo — No Login Required
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-outline text-lg px-8 py-4 flex items-center gap-3"
              >
                <MapPin className="w-5 h-5" />
                See Ramesh's Kirana Store
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-400">
              Pre-loaded with a real kirana store in Lucknow. Click and explore instantly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 gradient-bg">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-display font-extrabold text-white">{stat.value}</div>
              <div className="text-sm text-white/80 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              Three AI Features That <span className="gradient-text">Change Everything</span>
            </h3>
            <p className="mt-4 text-gray-500 text-lg">Each powered by Amazon Bedrock — real AI, not rule-based logic</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 + 0.5 }}
                className="card-elevated group cursor-pointer hover:-translate-y-1"
                onClick={() => navigate(feature.title.includes('Pricing') ? '/pricing' : feature.title.includes('Content') ? '/content' : '/sentiment')}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                  feature.color === 'saffron' ? 'bg-saffron-100 text-saffron-600' :
                  feature.color === 'bazaar' ? 'bg-bazaar-100 text-bazaar-600' :
                  'bg-royal-100 text-royal-600'
                }`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h4 className="font-display text-xl font-bold text-gray-900">{feature.title}</h4>
                <p className="text-sm font-hindi text-gray-400 mt-0.5">{feature.titleHi}</p>
                <p className="mt-3 text-gray-500 leading-relaxed">{feature.description}</p>
                <div className="mt-4 flex items-center text-saffron-500 text-sm font-medium group-hover:gap-2 transition-all">
                  Try it now <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
            Meet <span className="gradient-text">Ramesh</span>
          </h3>
          <p className="mt-6 text-xl text-gray-500 leading-relaxed">
            Ramesh runs a kirana store in Lucknow. He's about to list his products online for the first time.
            He doesn't know how to price against Amazon. He can't write product descriptions in Tamil for his South Indian customers.
            He has 50 reviews in Hinglish that he can't make sense of.
          </p>
          <p className="mt-6 text-xl text-gray-700 font-medium leading-relaxed">
            Watch what BharatBazaar AI does for him in 30 seconds.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-8 btn-primary text-lg px-10 py-4 flex items-center gap-3 mx-auto"
          >
            <Store className="w-5 h-5" />
            Enter Ramesh's Store
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="font-display text-2xl font-bold">Built on AWS</h3>
            <p className="text-gray-400 mt-2">100% serverless architecture on Amazon Web Services</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            {['Amazon Bedrock (Claude)', 'AWS Lambda', 'API Gateway', 'DynamoDB', 'S3', 'CloudFront', 'Cognito', 'CloudWatch'].map(tech => (
              <span key={tech} className="px-4 py-2 border border-gray-700 rounded-full">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-saffron-500" />
            <span className="font-display font-bold gradient-text">BharatBazaar AI</span>
            <span className="text-sm text-gray-400">by ParityAI</span>
          </div>
          <p className="text-sm text-gray-400">
            AI for Bharat Hackathon 2026 — Track: Retail, Commerce & Market Intelligence
          </p>
        </div>
      </footer>
    </div>
  )
}
