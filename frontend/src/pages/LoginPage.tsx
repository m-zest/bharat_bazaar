import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, User, Eye, EyeOff, AlertCircle, Store, ArrowRight } from 'lucide-react'
import { useAuth } from '../utils/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800))

    const success = login(username, password)
    if (success) {
      navigate('/dashboard')
    } else {
      setError('Invalid username or password')
    }
    setLoading(false)
  }

  const fillDemo = (user: string, pass: string) => {
    setUsername(user)
    setPassword(pass)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#0c0c0d] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg shadow-orange-500/20 mb-4"
          >
            <Store className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-100">BharatBazaar AI</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to your store dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1a1a1d] rounded-2xl shadow-xl shadow-black/30 border border-[#2a2a2d] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 bg-[#141416] border border-[#333] rounded-xl text-sm text-gray-100 placeholder:text-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-11 py-3 bg-[#141416] border border-[#333] rounded-xl text-sm text-gray-100 placeholder:text-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#333]" />
            <span className="text-xs text-gray-500 font-medium">DEMO ACCOUNTS</span>
            <div className="flex-1 h-px bg-[#333]" />
          </div>

          {/* Quick Login Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={() => fillDemo('admin', 'admin')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/20 rounded-xl transition-all text-left group"
            >
              <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">RS</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-200">Rajesh Sharma — Store Owner</p>
                <p className="text-xs text-gray-500">admin / admin</p>
              </div>
              <ArrowRight className="w-4 h-4 text-orange-400/60 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => fillDemo('manager', 'manager')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 rounded-xl transition-all text-left group"
            >
              <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">PG</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-200">Priya Gupta — Store Manager</p>
                <p className="text-xs text-gray-500">manager / manager</p>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-400/60 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Powered by AWS Bedrock & Amazon DynamoDB
        </p>
      </motion.div>
    </div>
  )
}
