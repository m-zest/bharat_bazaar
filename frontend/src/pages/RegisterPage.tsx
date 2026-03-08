import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Store, Package, User, Lock, Mail, Phone, MapPin, Building2, FileText, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck, AlertCircle, Zap } from 'lucide-react'
import { useAuth } from '../utils/AuthContext'

type Role = 'retailer' | 'supplier' | 'customer'

interface RoleOption {
  id: Role
  title: string
  subtitle: string
  description: string
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
}

const roles: RoleOption[] = [
  {
    id: 'retailer',
    title: 'Retailer',
    subtitle: 'Store Owner',
    description: 'I want to buy wholesale products',
    icon: Store,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/40',
  },
  {
    id: 'supplier',
    title: 'Supplier',
    subtitle: 'Wholesaler',
    description: 'I want to sell products to retailers',
    icon: Package,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/40',
  },
  {
    id: 'customer',
    title: 'Customer',
    subtitle: 'Buyer',
    description: 'I want to browse and discover products',
    icon: User,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/40',
  },
]

const DEMO_PROFILES: Record<Role, { fullName: string; phone: string; email: string; businessName: string; city: string; gstin: string; password: string }> = {
  retailer: {
    fullName: 'Ramesh Sharma',
    phone: '9876543210',
    email: 'ramesh@gmail.com',
    businessName: 'Sharma Kirana Store',
    city: 'Lucknow',
    gstin: '',
    password: 'demo123',
  },
  supplier: {
    fullName: 'Amit Gupta',
    phone: '9988776655',
    email: 'gupta.wholesale@gmail.com',
    businessName: 'Gupta Wholesale Traders',
    city: 'Delhi',
    gstin: '09AAACG1234F1ZM',
    password: 'demo123',
  },
  customer: {
    fullName: 'Priya Menon',
    phone: '9123456789',
    email: 'priya.menon@gmail.com',
    businessName: '',
    city: 'Mumbai',
    gstin: '',
    password: 'demo123',
  },
}

const cities = [
  'Lucknow',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Pune',
  'Jaipur',
  'Indore',
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [selectedRole, setSelectedRole] = useState<Role>('retailer')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [city, setCity] = useState('')
  const [gstin, setGstin] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const showBusinessName = selectedRole === 'retailer' || selectedRole === 'supplier'
  const showGstin = selectedRole === 'supplier'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    if (!city) {
      setError('Please select your city')
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSuccess(true)

    // Auto-login and go straight to dashboard
    const roleLabel = selectedRole === 'retailer' ? 'Store Owner' : selectedRole === 'supplier' ? 'Wholesaler' : 'Customer'
    register({
      name: fullName,
      role: roleLabel,
      store: businessName || fullName + "'s Store",
      city,
    })

    setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#0c0c0d] flex items-center justify-center p-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
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
          <h1 className="text-2xl font-bold text-gray-100">Create your account</h1>
          <p className="text-gray-500 mt-1 text-sm">Join BharatBazaar AI and grow your business</p>
        </div>

        {/* Success Overlay */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-[#1a1a1d] border border-[#2a2a2d] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-green-500/15 rounded-full mb-4"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-100 mb-2">
                  Registration successful!
                </h3>
                <p className="text-sm text-gray-400 mb-1">(Demo Mode)</p>
                {selectedRole === 'supplier' && (
                  <p className="text-sm text-amber-400 mt-3">
                    Your account is pending verification. You'll be notified once approved.
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-4">Redirecting to dashboard...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Registration Card */}
        <div className="bg-[#1a1a1d] rounded-2xl shadow-xl shadow-black/30 border border-[#2a2a2d] p-8">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">I am a...</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {roles.map((role) => {
                const Icon = role.icon
                const isSelected = selectedRole === role.id
                return (
                  <motion.button
                    key={role.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedRole(role.id)
                      setError('')
                    }}
                    className={`relative flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? `${role.bgColor} ${role.borderColor}`
                        : 'bg-[#141416] border-[#333] hover:border-[#444]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                        isSelected ? role.bgColor : 'bg-[#1a1a1d]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? role.color : 'text-gray-500'}`} />
                    </div>
                    <p className={`text-sm font-semibold ${isSelected ? 'text-gray-100' : 'text-gray-400'}`}>
                      {role.title}
                    </p>
                    <p className={`text-xs mt-0.5 ${isSelected ? 'text-gray-400' : 'text-gray-600'}`}>
                      {role.subtitle}
                    </p>
                    <p className={`text-xs mt-1.5 leading-relaxed ${isSelected ? 'text-gray-400' : 'text-gray-600'}`}>
                      {role.description}
                    </p>
                    {isSelected && (
                      <motion.div
                        layoutId="roleCheck"
                        className="absolute top-2 right-2"
                      >
                        <CheckCircle2 className={`w-4 h-4 ${role.color}`} />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Supplier Verification Notice */}
          <AnimatePresence>
            {selectedRole === 'supplier' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-6">
                  <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-300/90 leading-relaxed">
                    Supplier accounts require verification before you can list products. Our team will verify your business details within 24-48 hours. You'll receive a verification badge once approved.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Demo Quick Fill */}
          <div className="mb-6 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400" />
                <p className="text-sm font-semibold text-gray-200">Quick Demo Fill</p>
              </div>
              <span className="text-[10px] text-orange-400/70 bg-orange-500/10 px-2 py-0.5 rounded-full">For Judges</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">Auto-fill with sample data so you can quickly see the registration flow</p>
            <div className="flex gap-2">
              {roles.map((role) => (
                <motion.button
                  key={role.id}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    const demo = DEMO_PROFILES[role.id]
                    setSelectedRole(role.id)
                    setFullName(demo.fullName)
                    setPhone(demo.phone)
                    setEmail(demo.email)
                    setBusinessName(demo.businessName)
                    setCity(demo.city)
                    setGstin(demo.gstin)
                    setPassword(demo.password)
                    setConfirmPassword(demo.password)
                    setError('')
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    selectedRole === role.id
                      ? `bg-gradient-to-r ${role.id === 'retailer' ? 'from-orange-500 to-amber-500' : role.id === 'supplier' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-violet-500'} text-white shadow-md`
                      : 'bg-white/5 text-gray-400 border border-[#333] hover:border-[#444]'
                  }`}
                >
                  <role.icon className="w-3 h-3" />
                  {role.title}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 bg-[#141416] border border-[#333] rounded-xl text-sm text-gray-100 placeholder:text-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '')
                    if (val.length <= 10) setPhone(val)
                  }}
                  placeholder="9876543210"
                  className="w-full pl-[4.5rem] pr-4 py-3 bg-[#141416] border border-[#333] rounded-xl text-sm text-gray-100 placeholder:text-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email <span className="text-gray-600">(optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#141416] border border-[#333] rounded-xl text-sm text-gray-100 placeholder:text-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* Business Name (Retailer & Supplier) */}
            <AnimatePresence>
              {showBusinessName && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Business Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                      <input
                        type="text"
                        value={businessName}
                        onChange={e => setBusinessName(e.target.value)}
                        placeholder="Your business or store name"
                        className="w-full pl-10 pr-4 py-3 bg-[#141416] border border-[#333] rounded-xl text-sm text-gray-100 placeholder:text-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all outline-none"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#141416] border border-[#333] rounded-xl text-sm text-gray-100 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all outline-none appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled className="text-gray-600">Select your city</option>
                  {cities.map(c => (
                    <option key={c} value={c} className="bg-[#141416] text-gray-100">{c}</option>
                  ))}
                </select>
                <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 rotate-90 pointer-events-none" />
              </div>
            </div>

            {/* GSTIN (Supplier only) */}
            <AnimatePresence>
              {showGstin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      GSTIN <span className="text-gray-600">(optional)</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                      <input
                        type="text"
                        value={gstin}
                        onChange={e => setGstin(e.target.value.toUpperCase())}
                        placeholder="22AAAAA0000A1Z5"
                        maxLength={15}
                        className="w-full pl-10 pr-4 py-3 bg-[#141416] border border-[#333] rounded-xl text-sm text-gray-100 placeholder:text-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-11 py-3 bg-[#141416] border border-[#333] rounded-xl text-sm text-gray-100 placeholder:text-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#333]" />
            <span className="text-xs text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-[#333]" />
          </div>

          {/* Link to Login */}
          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Powered by AI
        </p>
      </motion.div>
    </div>
  )
}
