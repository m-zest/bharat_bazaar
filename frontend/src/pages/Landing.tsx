import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Store, IndianRupee, Languages, MessageSquareText, ArrowRight, Sparkles, MapPin, TrendingUp, Zap, Package, MessageCircle, CloudSun } from 'lucide-react'

const features = [
  {
    icon: Package,
    title: 'Smart Sourcing',
    titleHi: 'स्मार्ट सोर्सिंग',
    description: 'Find cheapest wholesale prices from verified suppliers near you. Order directly — we earn commission, you save money.',
    color: 'bazaar',
    route: '/sourcing',
    tag: 'KILLER FEATURE',
  },
  {
    icon: IndianRupee,
    title: 'Dynamic Pricing',
    titleHi: 'डायनामिक प्राइसिंग',
    description: 'AI analyzes competitor prices + weather + festivals + regional purchasing power to suggest optimal pricing.',
    color: 'saffron',
    route: '/pricing',
  },
  {
    icon: MessageCircle,
    title: 'AI Business Advisor',
    titleHi: 'AI बिज़नेस सलाहकार',
    description: '"Diwali ke liye kya stock karun?" — Ask in Hindi, English, or Hinglish. Get real answers with real prices.',
    color: 'royal',
    route: '/chat',
    tag: 'HINDI VOICE',
  },
  {
    icon: Languages,
    title: 'Multilingual Content',
    titleHi: 'बहुभाषी कंटेंट',
    description: 'Culturally adapted product descriptions in 6 Indian languages. Not translation — true cultural adaptation.',
    color: 'bazaar',
    route: '/content',
  },
  {
    icon: MessageSquareText,
    title: 'Hinglish Sentiment',
    titleHi: 'हिंगलिश सेंटिमेंट',
    description: 'Understands "Product accha hai but delivery slow thi" — real Indian language intelligence for reviews.',
    color: 'royal',
    route: '/sentiment',
  },
]

const stats = [
  { value: '12M+', label: 'Small Retailers in India', icon: Store },
  { value: '₹50K+', label: 'Lost Yearly per Store', icon: IndianRupee },
  { value: '70%', label: 'Prefer Regional Languages', icon: Languages },
  { value: '10', label: 'Indian Cities Covered', icon: MapPin },
]

const howItWorks = [
  { time: '6 AM', title: 'Morning Alert', titleHi: 'सुबह की अलर्ट', desc: '"Heavy rain predicted in Lucknow. Umbrella demand will spike 60%. Best price: ₹45/unit from Gupta Wholesale."', icon: CloudSun },
  { time: '9 AM', title: 'Price Intelligence', titleHi: 'प्राइस इंटेलिजेंस', desc: '"Your competitor dropped Basmati Rice to ₹420. Amazon: ₹449. Recommended: ₹415 (₹95 profit per unit)."', icon: TrendingUp },
  { time: '12 PM', title: 'Stock Alert', titleHi: 'स्टॉक अलर्ट', desc: '"~20 units of Surf Excel left. Stockout in 3 days. Best wholesale: ₹185/unit from Mehta Distributors."', icon: Package },
  { time: '4 PM', title: 'Customer Insights', titleHi: 'ग्राहक इनसाइट', desc: '"15 customers mentioned delivery speed negatively. Consider partnering with Dunzo for ₹15/delivery."', icon: MessageSquareText },
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
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-saffron-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-bazaar-200/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-saffron-50 text-saffron-600 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-saffron-100">
              <Sparkles className="w-4 h-4" />
              Powered by Amazon Bedrock (Claude AI)
            </div>

            <h2 className="font-display text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1]">
              The{' '}
              <span className="gradient-text">Intelligence Layer</span>
              <br />
              for Indian Retail
            </h2>

            <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              12 million kirana stores operate on gut feeling. BharatBazaar AI connects them to
              <span className="font-semibold text-gray-700"> wholesale prices, market intelligence, and AI-powered business advice </span>
              — all in their own language.
            </p>

            <p className="mt-3 text-lg font-hindi text-saffron-500 font-medium">
              हर दुकानदार के लिए AI की ताक़त — बिल्कुल FREE
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary text-lg px-8 py-4 flex items-center gap-3"
              >
                <Zap className="w-5 h-5" />
                Try Live Demo — No Login
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="btn-outline text-lg px-8 py-4 flex items-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                Talk to AI Advisor
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-400">
              Pre-loaded with Ramesh's Kirana Store in Lucknow. Click and explore instantly.
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
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-display font-extrabold text-white">{stat.value}</div>
              <div className="text-sm text-white/80 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              A Day in <span className="gradient-text">Ramesh's</span> Life
            </h3>
            <p className="mt-3 text-gray-500 text-lg">How BharatBazaar AI transforms a kirana store owner's decisions</p>
          </div>
          <div className="space-y-4">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.time}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 + 0.3 }}
                className="flex gap-5 items-start bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-bold text-saffron-500 text-center mt-1">{step.time}</p>
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-900">{step.title}</h4>
                  <p className="text-xs font-hindi text-gray-400">{step.titleHi}</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed italic">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              5 Connected Features That <span className="gradient-text">Win</span>
            </h3>
            <p className="mt-4 text-gray-500 text-lg">Not isolated tools — an integrated ecosystem powered by Amazon Bedrock</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className={`card-elevated group cursor-pointer hover:-translate-y-1 transition-all relative ${
                  i === 0 ? 'ring-2 ring-bazaar-200' : ''
                }`}
                onClick={() => navigate(feature.route)}
              >
                {feature.tag && (
                  <span className={`absolute -top-2 right-4 text-[10px] font-bold px-3 py-0.5 rounded-full ${
                    feature.tag === 'KILLER FEATURE' ? 'bg-bazaar-500 text-white' : 'bg-royal-500 text-white'
                  }`}>
                    {feature.tag}
                  </span>
                )}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                  feature.color === 'saffron' ? 'bg-saffron-100 text-saffron-600' :
                  feature.color === 'bazaar' ? 'bg-bazaar-100 text-bazaar-600' :
                  'bg-royal-100 text-royal-600'
                }`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h4 className="font-display text-xl font-bold text-gray-900">{feature.title}</h4>
                <p className="text-xs font-hindi text-gray-400 mt-0.5">{feature.titleHi}</p>
                <p className="mt-3 text-gray-500 leading-relaxed text-sm">{feature.description}</p>
                <div className="mt-4 flex items-center text-saffron-500 text-sm font-medium group-hover:gap-2 transition-all">
                  Try it now <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Model + Tech Stack */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="font-display text-2xl md:text-3xl font-bold">How BharatBazaar AI Makes Money</h3>
            <p className="text-gray-400 mt-2">Free for retailers. Commission from wholesalers. Premium subscriptions later.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '1', title: 'FREE AI Advice', desc: 'Retailers get pricing, content & sentiment analysis at zero cost' },
              { step: '2', title: 'Wholesale Orders', desc: 'Retailers order stock through us. We take 2-3% commission from wholesalers' },
              { step: '3', title: 'Premium Upsell', desc: 'Power users pay ₹999/month for advanced forecasting & priority alerts' },
            ].map(item => (
              <div key={item.step} className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-full bg-saffron-500 flex items-center justify-center mx-auto mb-3 text-lg font-bold">{item.step}</div>
                <h4 className="font-display font-bold text-lg">{item.title}</h4>
                <p className="text-sm text-gray-400 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">Built on</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              {['Amazon Bedrock (Claude)', 'AWS Lambda', 'API Gateway', 'DynamoDB', 'S3', 'CloudFront', 'CloudWatch'].map(tech => (
                <span key={tech} className="px-4 py-2 border border-gray-700 rounded-full text-xs">{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-display text-3xl font-bold text-gray-900">Ready to see it in action?</h3>
          <p className="mt-4 text-gray-500 text-lg">No login. No credit card. Just click and explore Ramesh's store.</p>
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
