import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import ConverterWidget from '../components/dashboard/ConverterWidget'
import ArithmeticWidget from '../components/dashboard/ArithmeticWidget'
import RecentHistory from '../components/dashboard/RecentHistory'
import StatsCards from '../components/dashboard/StatsCards'
import { historyAPI } from '../services/api'
import { Calculator, ArrowLeftRight } from 'lucide-react'

const TABS = [
  { id: 'convert',    label: 'Converter',   icon: ArrowLeftRight },
  { id: 'arithmetic', label: 'Arithmetic',  icon: Calculator },
]

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [history,        setHistory]        = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [activeTab,      setActiveTab]      = useState('convert')

  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated) return
    setLoadingHistory(true)
    try {
      const data = await historyAPI.getMyHistory()
      setHistory(Array.isArray(data) ? data : [])
    } catch { /* silent — history service may be starting */ }
    finally { setLoadingHistory(false) }
  }, [isAuthenticated])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">
          {isAuthenticated && user
            ? `${greeting()}, ${user.username} 👋`
            : 'Quantity Calculator'}
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {isAuthenticated
            ? 'All calculations are saved to your history automatically.'
            : 'Sign in to track your conversion & calculation history.'}
        </p>
      </div>

      {/* Stats — only when logged in and have history */}
      {isAuthenticated && history.length > 0 && (
        <StatsCards history={history} />
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 bg-surface-100 dark:bg-surface-800 p-1 rounded-xl w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200
              ${activeTab === id
                ? 'bg-white dark:bg-surface-900 text-brand-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className={`grid gap-6 ${isAuthenticated ? 'lg:grid-cols-[1fr_360px]' : ''}`}>
        {/* Widget area */}
        <div className="animate-slide-up">
          {activeTab === 'convert' ? (
            <>
              <h2 className="font-display font-semibold text-base text-[var(--text-primary)] mb-3">
                Unit Converter
                <span className="ml-2 text-xs font-normal text-[var(--text-secondary)]">
                  — results appear as you type
                </span>
              </h2>
              <ConverterWidget onConversionDone={fetchHistory} />
            </>
          ) : (
            <>
              <h2 className="font-display font-semibold text-base text-[var(--text-primary)] mb-3">
                Arithmetic Operations
                <span className="ml-2 text-xs font-normal text-[var(--text-secondary)]">
                  — add, subtract, multiply, divide, compare
                </span>
              </h2>
              <ArithmeticWidget onOperationDone={fetchHistory} />
            </>
          )}
        </div>

        {/* Recent history sidebar — only when logged in */}
        {isAuthenticated && (
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="font-display font-semibold text-base text-[var(--text-primary)] mb-3">
              Recent Activity
            </h2>
            <RecentHistory items={history} loading={loadingHistory} />
          </div>
        )}
      </div>

      {/* Login nudge when not authenticated */}
      {!isAuthenticated && (
        <div className="card p-6 border-dashed border-brand-200 dark:border-brand-800 text-center animate-fade-in">
          <p className="text-3xl mb-2">🔒</p>
          <h3 className="font-display font-semibold text-[var(--text-primary)] mb-1">
            Track Every Calculation
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Create a free account to save conversions & arithmetic history, view analytics, and more.
          </p>
          <div className="flex gap-3 justify-center">
            <a href="/register" className="btn-primary text-sm py-2 px-5">Sign Up Free</a>
            <a href="/login"    className="btn-secondary text-sm py-2 px-5">Sign In</a>
          </div>
        </div>
      )}
    </div>
  )
}
