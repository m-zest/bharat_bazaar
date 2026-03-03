import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Store, MapPin, Phone, Mail, Globe, Clock, Shield, Save,
  Camera, Edit3, IndianRupee, Users, Package, TrendingUp,
  Award, CheckCircle2
} from 'lucide-react'
import { useAuth } from '../utils/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    storeName: 'Sharma Kirana Store',
    ownerName: user?.name || 'Rajesh Sharma',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@gmail.com',
    address: 'Shop No. 42, Aminabad Market',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226018',
    gst: '09AABCS1234A1ZX',
    category: 'Kirana / General Store',
    established: '2015',
    openTime: '8:00 AM',
    closeTime: '10:00 PM',
    languages: ['Hindi', 'English'],
    upiId: 'sharma.kirana@upi',
  })

  const handleSave = () => {
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const stats = [
    { label: 'Monthly Revenue', value: '₹4.2L', icon: IndianRupee, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Products Listed', value: '156', icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Customer Base', value: '850+', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Growth Rate', value: '+23%', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Store Profile</h1>
          <p className="text-gray-400 text-sm">Manage your store details and settings</p>
        </div>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-medium"
          >
            <CheckCircle2 className="w-4 h-4" />
            Settings saved!
          </motion.div>
        )}
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 mb-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-5">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
            {user?.avatar || 'RS'}
          </div>
          <div>
            <h2 className="text-xl font-bold">{form.storeName}</h2>
            <p className="text-white/80 text-sm flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              {form.address}, {form.city}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                <Shield className="w-3 h-3" />
                GST Verified
              </span>
              <span className="flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                <Award className="w-3 h-3" />
                Since {form.established}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] p-4"
          >
            <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center mb-2`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-xl font-bold text-gray-100">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Details Form */}
      <div className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-100">Store Details</h3>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              editing
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-white/[0.03] hover:bg-white/[0.06] text-gray-300'
            }`}
          >
            {editing ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            {editing ? 'Save Changes' : 'Edit'}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Store Name', key: 'storeName', icon: Store },
            { label: 'Owner Name', key: 'ownerName', icon: Users },
            { label: 'Phone', key: 'phone', icon: Phone },
            { label: 'Email', key: 'email', icon: Mail },
            { label: 'City', key: 'city', icon: MapPin },
            { label: 'PIN Code', key: 'pincode', icon: MapPin },
            { label: 'GST Number', key: 'gst', icon: Shield },
            { label: 'Category', key: 'category', icon: Package },
            { label: 'Opening Time', key: 'openTime', icon: Clock },
            { label: 'Closing Time', key: 'closeTime', icon: Clock },
            { label: 'UPI ID', key: 'upiId', icon: IndianRupee },
            { label: 'Established', key: 'established', icon: Award },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-400 mb-1">{field.label}</label>
              <div className="relative">
                <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  value={(form as any)[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  disabled={!editing}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm transition-all outline-none ${
                    editing
                      ? 'bg-[#141416] border-[#333] text-gray-100 focus:ring-2 focus:ring-orange-500'
                      : 'bg-white/[0.03] border-[#2a2a2d] text-gray-300'
                  }`}
                />
              </div>
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-400 mb-1">Full Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <textarea
                value={`${form.address}, ${form.city}, ${form.state} - ${form.pincode}`}
                disabled={!editing}
                rows={2}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm transition-all outline-none resize-none ${
                  editing
                    ? 'bg-[#141416] border-[#333] text-gray-100 focus:ring-2 focus:ring-orange-500'
                    : 'bg-white/[0.03] border-[#2a2a2d] text-gray-300'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AWS Integration Info */}
      <div className="mt-6 bg-white/[0.03] rounded-xl border border-[#2a2a2d] p-5">
        <h3 className="font-bold text-gray-100 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-orange-500" />
          Platform Integrations
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { name: 'Amazon Bedrock', status: 'Connected', desc: 'AI pricing, content, sentiment' },
            { name: 'DynamoDB', status: 'Active', desc: 'Inventory & order storage' },
            { name: 'WhatsApp Business', status: 'Configured', desc: 'Customer notifications' },
          ].map(integration => (
            <div key={integration.name} className="bg-[#1a1a1d] rounded-lg border border-[#2a2a2d] p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs text-green-400 font-medium">{integration.status}</span>
              </div>
              <p className="text-sm font-semibold text-gray-100">{integration.name}</p>
              <p className="text-xs text-gray-500">{integration.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
