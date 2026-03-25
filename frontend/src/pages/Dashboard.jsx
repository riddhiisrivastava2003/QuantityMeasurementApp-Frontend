import { useEffect, useMemo, useState } from 'react'

const UNITS = {
  length: {
    base: 'meter',
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    inch: 0.0254,
    feet: 0.3048,
  },
  weight: {
    base: 'gram',
    gram: 1,
    kilogram: 1000,
    tonne: 1000000,
  },
  temp: {
    base: 'celsius',
    celsius: 1,
    fahrenheit: 1,
  },
  volume: {
    base: 'litre',
    litre: 1,
    millilitre: 0.001,
    gallon: 3.78541,
  },
}

const ACTION_LABELS = {
  compare: 'Comparison',
  convert: 'Conversion',
  arithmetic: 'Arithmetic',
}

const UNIT_LABELS = {
  meter: 'm',
  kilometer: 'km',
  centimeter: 'cm',
  inch: 'in',
  feet: 'ft',
  gram: 'g',
  kilogram: 'kg',
  tonne: 't',
  celsius: '°C',
  fahrenheit: '°F',
  litre: 'L',
  millilitre: 'mL',
  gallon: 'gal',
}

const PRECISION_BY_TYPE = {
  length: 2,
  weight: 2,
  temp: 1,
  volume: 2,
}

const ARITHMETIC_LABELS = {
  add: 'Add',
  subtract: 'Subtract',
  multiply: 'Multiply',
}

function convertToBase(value, unit, type) {
  if (type === 'temp' && unit !== UNITS[type].base) {
    if (unit === 'fahrenheit') return (value - 32) * (5 / 9)
  }
  return value * UNITS[type][unit]
}

function convertFromBase(value, unit, type) {
  if (type === 'temp' && unit !== UNITS[type].base) {
    if (unit === 'fahrenheit') return value * (9 / 5) + 32
  }
  return value / UNITS[type][unit]
}

function Dashboard() {
  const [theme, setTheme] = useState('light')
  const [currentAction, setCurrentAction] = useState('compare')
  const [currentType, setCurrentType] = useState('length')
  const [arithmeticOp, setArithmeticOp] = useState('add')
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const [unit1, setUnit1] = useState('meter')
  const [unit2, setUnit2] = useState('meter')
  const [resultUnit, setResultUnit] = useState('meter')
  const [result, setResult] = useState('0')
  const [precision, setPrecision] = useState(PRECISION_BY_TYPE.length)

  const unitOptions = useMemo(
    () => Object.keys(UNITS[currentType]).filter((unit) => unit !== 'base'),
    [currentType],
  )

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    const nextTheme = storedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(nextTheme)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const defaultUnit = UNITS[currentType].base
    setUnit1(defaultUnit)
    setUnit2(defaultUnit)
    setResultUnit(defaultUnit)
    setPrecision(PRECISION_BY_TYPE[currentType])
  }, [currentType])

  useEffect(() => {
    const v1 = parseFloat(value1) || 0
    const v2 = parseFloat(value2) || 0

    const baseV1 = convertToBase(v1, unit1, currentType)
    const baseV2 = convertToBase(v2, unit2, currentType)

    let nextResult
    if (currentAction === 'arithmetic') {
      let raw = baseV1 + baseV2
      if (arithmeticOp === 'subtract') raw = baseV1 - baseV2
      if (arithmeticOp === 'multiply') raw = baseV1 * baseV2
      nextResult = convertFromBase(raw, resultUnit, currentType)
    } else if (currentAction === 'compare') {
      nextResult = baseV1 === baseV2 ? 'Equal' : 'Not Equal'
    } else {
      nextResult = convertFromBase(baseV1, resultUnit, currentType)
    }

    if (typeof nextResult === 'number') {
      setResult(nextResult.toFixed(precision))
    } else {
      setResult(nextResult)
    }
  }, [
    currentAction,
    currentType,
    arithmeticOp,
    value1,
    value2,
    unit1,
    unit2,
    resultUnit,
    precision,
  ])

  const actionLabel = ACTION_LABELS[currentAction]
  const typeLabel = {
    length: 'Length',
    weight: 'Weight',
    temp: 'Temperature',
    volume: 'Volume',
  }[currentType]

  const actionSymbol =
    currentAction === 'arithmetic'
      ? arithmeticOp === 'add'
        ? '+'
        : arithmeticOp === 'subtract'
          ? '−'
          : '×'
      : currentAction === 'convert'
        ? '→'
        : '=='

  const showSecondValue = currentAction !== 'convert'
  const showResultUnit = currentAction !== 'compare'
  const resultUnitLabel = UNIT_LABELS[resultUnit] || resultUnit

  return (
    <section className="dashboard dashboard-page">
      <div className="container">
        <div className="card">
          <button
            className="theme-toggle"
            type="button"
            onClick={() =>
              setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
            }
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>

          <div className="hero">
            <div className="hero-text">
              <p className="eyebrow">Quantity Suite</p>
              <h1 className="title">Measurement Dashboard</h1>
              <p className="subtitle">
                Compare, convert, or compute across units with instant feedback.
              </p>
            </div>
            <div className="meta-cards">
              <div className="meta-card pulse" key={currentType}>
                <span className="meta-label">Active Type</span>
                <span className="meta-value">{typeLabel}</span>
              </div>
              <div className="meta-card pulse" key={currentAction}>
                <span className="meta-label">Active Action</span>
                <span className="meta-value">{actionLabel}</span>
              </div>
            </div>
          </div>

          <div className="main-grid">
            <div className="panel">
              <div className="panel-header">
                <h2>Selection</h2>
                <p>Pick what you want to measure and how you want to work.</p>
              </div>

              <div className="selection-group">
                <h6>CHOOSE TYPE</h6>
                <div className="btn-group">
                  {['length', 'weight', 'temp', 'volume'].map((type) => (
                    <button
                      key={type}
                      className={`btn ${currentType === type ? 'active' : ''}`}
                      type="button"
                      onClick={() => setCurrentType(type)}
                    >
                      {type === 'temp' ? 'Temperature' : type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="selection-group">
                <h6>CHOOSE ACTION</h6>
                <div className="btn-group">
                  {['compare', 'convert', 'arithmetic'].map((action) => (
                    <button
                      key={action}
                      className={`btn ${currentAction === action ? 'active' : ''}`}
                      type="button"
                      onClick={() => setCurrentAction(action)}
                    >
                      {ACTION_LABELS[action]}
                    </button>
                  ))}
                </div>
              </div>

              {currentAction === 'arithmetic' && (
                <div className="selection-group">
                  <h6>ARITHMETIC MODE</h6>
                  <div className="btn-group">
                    {['add', 'subtract', 'multiply'].map((mode) => (
                      <button
                        key={mode}
                        className={`btn ${arithmeticOp === mode ? 'active' : ''}`}
                        type="button"
                        onClick={() => setArithmeticOp(mode)}
                      >
                        {ARITHMETIC_LABELS[mode]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="selection-group">
                <h6>PRECISION</h6>
                <div className="btn-group">
                  {[0, 1, 2, 3, 4].map((digits) => (
                    <button
                      key={digits}
                      className={`btn ${precision === digits ? 'active' : ''}`}
                      type="button"
                      onClick={() => setPrecision(digits)}
                    >
                      {digits} dp
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h2>Calculator</h2>
                <p>Enter values to compute instantly.</p>
              </div>

              <div className="input-section">
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Value 1"
                    value={value1}
                    onChange={(event) => setValue1(event.target.value)}
                  />
                  <select
                    className="form-control-unit"
                    value={unit1}
                    onChange={(event) => setUnit1(event.target.value)}
                  >
                    {unitOptions.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="action-btn" type="button">
                  {actionSymbol}
                </button>

                {showSecondValue && (
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Value 2"
                      value={value2}
                      onChange={(event) => setValue2(event.target.value)}
                    />
                    <select
                      className="form-control-unit"
                      value={unit2}
                      onChange={(event) => setUnit2(event.target.value)}
                    >
                      {unitOptions.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="result-section">
                <h5>Result:</h5>
                <h3>
                  {result}
                  {showResultUnit && (
                    <span className="unit-label"> {resultUnitLabel}</span>
                  )}
                </h3>
                {showResultUnit && (
                  <div className="result-unit-wrapper">
                    <select
                      className="form-control-unit"
                      value={resultUnit}
                      onChange={(event) => setResultUnit(event.target.value)}
                    >
                      {unitOptions.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
