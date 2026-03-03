import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  username: string
  name: string
  role: string
  store: string
  city: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: 'admin',
    user: {
      username: 'admin',
      name: 'Rajesh Sharma',
      role: 'Store Owner',
      store: 'Sharma Kirana Store',
      city: 'Lucknow',
      avatar: 'RS',
    },
  },
  manager: {
    password: 'manager',
    user: {
      username: 'manager',
      name: 'Priya Gupta',
      role: 'Store Manager',
      store: 'Sharma Kirana Store',
      city: 'Lucknow',
      avatar: 'PG',
    },
  },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bb_user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('bb_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('bb_user')
    }
  }, [user])

  const login = (username: string, password: string): boolean => {
    const entry = DEMO_USERS[username.toLowerCase()]
    if (entry && entry.password === password) {
      setUser(entry.user)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
