import React, { useState } from 'react'
import { Loader2, Equal, Calculator } from 'lucide-react'
import { quantityAPI, historyAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { UNIT_CATEGORIES } from '../../utils/units'
import toast from 'react-hot-toast'

// Operations that take two quantities with units
const DUAL_OPS = [
  { id: 'add',      label: 'Add',      symbol: '+', desc: 'Add two quantities (auto-converts units)' },
  { id: 'subtract', label: 'Subtract', symbol: '−', desc: 'Subtract Q2 from Q1' },
  { id: 'compare',  label: 'Compare',  symbol: '?', desc: 'Check which quantity is larger' },
]

// Operations that take one quantity + a scalar number
const SCALAR_OPS = [
  { id: 'multiply', label: 'Multiply', symbol: '×', desc: 'Multiply quantity by a number' },
  { id: 'divide',   label: 'Divide',   symbol: '÷', desc: 'Divide quantity by a number' },
]

const ALL_OPS = [...DUAL_OPS, ...SCALAR_OPS]

export default function ArithmeticWidget({ onOperationDone }) {
  const { isAuthenticated, user } = useAuth()

  const [op,         setOp]         = useState('add')
  const [category,   setCategory]   = useState('length')
  const [value1,     setValue1]     = useState('')
  const [unit1,      setUnit1]      = useState('FEET')
  const [value2,     setValue2]     = useState('')
  const [unit2,      setUnit2]      = useState('INCHES')
  const [scalar,     setScalar]     = useState('')
  const [resultUnit, setResultUnit] = useState('FEET')
  const [result,     setResult]     = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [resultKey,  setResultKey]  = useState(0)

  const currentCategory = UNIT_CATEGORIES.find(c => c.id === category)
  const isDualOp   = DUAL_OPS.some(o => o.id === op)
  const isScalarOp = SCALAR_OPS.some(o => o.id === op)
  const currentOp  = ALL_OPS.find(o => o.id === op)

  // When category changes, update default units
  const handleCategoryChange = (catId) => {
    setCategory(catId)
    const cat = UNIT_CATEGORIES.find(c => c.id === catId)
    if (cat?.units.length >= 2) {
      setUnit1(cat.units[0].value)
      setUnit2(cat.units[1].value)
      setResultUnit(cat.units[0].value)
    }
    setResult(null)
  }

  const handleSubmit = async () => {
    if (!value1 || isNaN(Number(value1))) return toast.error('Enter a valid first value')
    if (isDualOp  && (!value2 || isNaN(Number(value2)))) return toast.error('Enter a valid second value')
    if (isScalarOp && (!scalar || isNaN(Number(scalar)))) return toast.error('Enter a valid number')

    setLoading(true)
    setResult(null)
    try {
      let data
      const v1 = Number(value1)
      const v2 = Number(value2)
      const sc = Number(scalar)

      switch (op) {
        case 'add':
          data = await quantityAPI.add({ value1: v1, unit1, value2: v2, unit2, resultUnit })
          break
        case 'subtract':
          data = await quantityAPI.subtract({ value1: v1, unit1, value2: v2, unit2, resultUnit })
          break
        case 'compare':
          data = await quantityAPI.compare({ value1: v1, unit1, value2: v2, unit2 })
          break
        case 'multiply':
          data = await quantityAPI.multiply({ value1: v1, unit1, scalar: sc })
          break
        case 'divide':
          data = await quantityAPI.divide({ value1: v1, unit1, scalar: sc })
          break
        default:
          throw new Error('Unknown operation')
      }

      setResult(data)
      setResultKey(k => k + 1)

      // Save to history if logged in
      if (isAuthenticated && user && op !== 'compare') {
        await historyAPI.save({
          username:        user.username,
          operation:       op.toUpperCase(),
          fromUnit:        unit1,
          toUnit:          isDualOp ? unit2 : 'SCALAR',
          inputValue:      v1,
          result:          String(data.result),
          measurementType: currentCategory?.label?.toUpperCase() || 'UNKNOWN',
        }).catch(() => {})
        onOperationDone?.()
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const formatResult = (res) => {
    if (!res) return null
    if (op === 'compare') {
      const icons = { EQUAL: '=', GREATER: '>', LESS: '<' }
      const colors = { EQUAL: 'text-brand-600', GREATER: 'text-amber-600', LESS: 'text-rose-600' }
      return (
        <div key={resultKey} className="result-pop text-center py-2">
          <div className={`font-display font-bold text-5xl mb-2 ${colors[res.result]}`}>
            {icons[res.result]}
          </div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            {value1} {unit1} is <span className={colors[res.result]}>{res.result}</span> to {value2} {unit2}
          </p>
        </div>
      )
    }
    const num = typeof res.result === 'number' ? res.result : Number(res.result)
    const outUnit = res.resultUnit || res.unit1 || unit1
    return (
      <div key={resultKey} className="result-pop space-y-1">
        <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">Result</p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-mono font-bold text-3xl text-[var(--text-primary)]">
            {num.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </span>
          <span className="text-brand-600 dark:text-brand-400 font-semibold">{outUnit}</span>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          {op === 'multiply'
            ? `${value1} ${unit1} × ${scalar} = ${num.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${outUnit}`
            : op === 'divide'
            ? `${value1} ${unit1} ÷ ${scalar} = ${num.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${outUnit}`
            : `${value1} ${unit1} ${currentOp?.symbol} ${value2} ${unit2} = ${num.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${outUnit}`}
        </p>
      </div>
    )
  }

  return (
    <div className="card p-6 space-y-5">

      {/* Operation tabs */}
      <div className="space-y-2">
        <p className="label">Operation</p>
        <div className="flex flex-wrap gap-2">
          {ALL_OPS.map(o => (
            <button
              key={o.id}
              onClick={() => { setOp(o.id); setResult(null) }}
              title={o.desc}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${op === o.id
                  ? 'bg-brand-600 text-white shadow-glow-sm'
                  : 'bg-surface-100 dark:bg-surface-800 text-gray-600 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-surface-700'
                }`}
            >
              <span className="font-mono text-base leading-none">{o.symbol}</span>
              {o.label}
            </button>
          ))}
        </div>
        {/* op description */}
        <p className="text-xs text-[var(--text-secondary)] italic">{currentOp?.desc}</p>
      </div>

      {/* Category selector (only for dual ops) */}
      {isDualOp && (
        <div className="flex flex-wrap gap-2">
          {UNIT_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${category === cat.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-100 dark:bg-surface-800 text-gray-500 hover:bg-brand-50'
                }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Inputs */}
      <div className="space-y-4">
        {/* First quantity */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">
              {isDualOp ? 'First value' : 'Value'}
            </label>
            <input
              type="number"
              value={value1}
              onChange={e => setValue1(e.target.value)}
              placeholder="e.g. 10"
              className="input-field font-mono"
            />
          </div>
          <div>
            <label className="label">Unit</label>
            <select
              value={unit1}
              onChange={e => { setUnit1(e.target.value); setResultUnit(e.target.value) }}
              className="select-field"
            >
              {(isDualOp ? currentCategory?.units : UNIT_CATEGORIES.flatMap(c => c.units))
                ?.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        </div>

        {/* Operator badge */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
            <span className="font-mono font-bold text-brand-600 dark:text-brand-400 text-base">
              {currentOp?.symbol}
            </span>
          </div>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {/* Second quantity (dual ops) */}
        {isDualOp && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Second value</label>
              <input
                type="number"
                value={value2}
                onChange={e => setValue2(e.target.value)}
                placeholder="e.g. 6"
                className="input-field font-mono"
              />
            </div>
            <div>
              <label className="label">Unit</label>
              <select
                value={unit2}
                onChange={e => setUnit2(e.target.value)}
                className="select-field"
              >
                {currentCategory?.units.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Scalar (scalar ops) */}
        {isScalarOp && (
          <div>
            <label className="label">
              {op === 'multiply' ? 'Multiply by' : 'Divide by'}
            </label>
            <input
              type="number"
              value={scalar}
              onChange={e => setScalar(e.target.value)}
              placeholder="e.g. 3"
              className="input-field font-mono"
            />
          </div>
        )}

        {/* Result unit (add/subtract only) */}
        {(op === 'add' || op === 'subtract') && (
          <div>
            <label className="label">Express result in</label>
            <select
              value={resultUnit}
              onChange={e => setResultUnit(e.target.value)}
              className="select-field"
            >
              {currentCategory?.units.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Calculate button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary w-full py-3"
      >
        {loading
          ? <><Loader2 size={18} className="animate-spin" /> Calculating…</>
          : <><Calculator size={18} /> Calculate</>
        }
      </button>

      {/* Result panel */}
      <div className={`rounded-2xl p-5 transition-all duration-200
        ${result !== null
          ? 'bg-gradient-to-br from-brand-50 to-accent-50/40 dark:from-brand-900/30 dark:to-accent-900/20 border border-brand-100 dark:border-brand-800'
          : 'bg-surface-50 dark:bg-surface-800 border border-dashed border-gray-200 dark:border-surface-700'
        }`}
      >
        {result !== null
          ? formatResult(result)
          : (
            <p className="text-center text-[var(--text-secondary)] text-sm py-2">
              Enter values and press Calculate
            </p>
          )
        }
      </div>
    </div>
  )
}
