import React, { useState, useEffect } from 'react'
import { User, LogOut, Shield, Calendar, BarChart3, Mail, Globe } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { historyAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const history = await historyAPI.getMyHistory()
        const arr = Array.isArray(history) ? history : []
        const cats = arr.reduce((acc, h) => {
          const k = h.measurementType || 'UNKNOWN'
          acc[k] = (acc[k] || 0) + 1
          return acc
        }, {})
        const today = new Date().toDateString()
        setStats({
          total:      arr.length,
          today:      arr.filter(h => new Date(h.createdAt).toDateString() === today).length,
          topCat:     Object.entries(cats).sort((a,b) => b[1]-a[1])[0]?.[0] || '—',
          categories: cats,
        })
      } catch {
        setStats({ total: 0, today: 0, topCat: '—', categories: {} })
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/')
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown'

  const isGoogleUser = user?.provider === 'google'

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Profile</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-0.5">Your account details and usage stats</p>
      </div>

      {/* Profile card */}
      <div className="card p-6 animate-slide-up">
        <div className="flex flex-wrap items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-glow">
            <span className="text-white font-display font-bold text-3xl">
              {(user?.username || 'U')[0].toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">{user?.username}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="badge bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                  <Shield size={11} /> {user?.role || 'USER'}
                </span>
                {isGoogleUser ? (
                  <span className="badge bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    <Globe size={11} /> Google Account
                  </span>
                ) : (
                  <span className="badge bg-surface-100 dark:bg-surface-800 text-[var(--text-secondary)]">
                    <User size={11} /> Local Account
                  </span>
                )}
                <span className="badge bg-surface-100 dark:bg-surface-800 text-[var(--text-secondary)]">
                  <Calendar size={11} /> Joined {memberSince}
                </span>
              </div>
            </div>

            {/* Email row */}
            {user?.email && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Mail size={14} className="text-brand-500 flex-shrink-0" />
                <span className="font-mono">{user.email}</span>
              </div>
            )}
          </div>

          <button onClick={handleLogout} className="btn-danger text-sm py-2 px-4 flex-shrink-0">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="card h-24 shimmer" />)}
        </div>
      ) : stats && (
        <div className="animate-fade-in">
          <h3 className="font-display font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <BarChart3 size={17} className="text-brand-500" /> Usage Stats
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Operations', value: stats.total,  icon: '🔄' },
              { label: "Today",            value: stats.today,  icon: '📅' },
              { label: 'Top Category',     value: stats.topCat, icon: '⭐' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="card p-4 text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="font-display font-bold text-2xl text-[var(--text-primary)]">{value}</div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Category breakdown */}
          {Object.keys(stats.categories).length > 0 && (
            <div className="card p-5 mt-4">
              <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Category Breakdown</h4>
              <div className="space-y-2.5">
                {Object.entries(stats.categories).sort((a,b) => b[1]-a[1]).map(([cat, count]) => {
                  const pct = stats.total > 0 ? (count / stats.total * 100) : 0
                  const colors = {
                    LENGTH: 'bg-brand-500', WEIGHT: 'bg-amber-500',
                    TEMPERATURE: 'bg-rose-500', VOLUME: 'bg-teal-500', UNKNOWN: 'bg-gray-400'
                  }
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-xs text-[var(--text-secondary)] w-24 flex-shrink-0">{cat}</span>
                      <div className="flex-1 bg-surface-100 dark:bg-surface-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${colors[cat] || 'bg-gray-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-[var(--text-secondary)] w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick nav */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in">
        <button onClick={() => navigate('/dashboard')} className="btn-secondary py-3">Dashboard</button>
        <button onClick={() => navigate('/history')}   className="btn-secondary py-3">Full History</button>
      </div>
    </div>
  )
}
