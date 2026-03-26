import { useState, useEffect } from "react";

function Dashboard() {
  const [action, setAction] = useState("convert");
  const [type, setType] = useState("length");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [unit1, setUnit1] = useState("meter");
  const [unit2, setUnit2] = useState("meter");
  const [resultUnit, setResultUnit] = useState("meter");
  const [result, setResult] = useState("");
  const [precision, setPrecision] = useState(2);
  const [darkMode, setDarkMode] = useState(false);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const units = {
    length: { meter:1, kilometer:1000, centimeter:0.01, millimeter:0.001, inch:0.0254, feet:0.3048, yard:0.9144, mile:1609.34 },
    weight: { gram:1, kilogram:1000, tonne:1000000, pound:453.592, ounce:28.3495 },
    temperature: { celsius:1, fahrenheit:1, kelvin:1 },
    volume: { litre:1, millilitre:0.001, gallon:3.78541, quart:0.946353, pint:0.473176 },
    area: { square_meter:1, square_kilometer:1000000, square_centimeter:0.0001, square_feet:0.092903, acre:4046.86, hectare:10000 }
  };

  const unitLabels = {
    meter:"m", kilometer:"km", centimeter:"cm", millimeter:"mm",
    inch:"in", feet:"ft", yard:"yd", mile:"mi",
    gram:"g", kilogram:"kg", tonne:"t", pound:"lb", ounce:"oz",
    celsius:"°C", fahrenheit:"°F", kelvin:"K",
    litre:"L", millilitre:"mL", gallon:"gal", quart:"qt", pint:"pt",
    square_meter:"m²", square_kilometer:"km²", square_centimeter:"cm²", square_feet:"ft²", acre:"ac", hectare:"ha"
  };

  const convertToBase = (v,u)=>{
    if(type==="temperature"){
      if(u==="fahrenheit") return (v-32)*5/9;
      if(u==="kelvin") return v-273.15;
      return v;
    }
    return v * units[type][u];
  };

  const convertFromBase = (v,u)=>{
    if(type==="temperature"){
      if(u==="fahrenheit") return (v*9/5)+32;
      if(u==="kelvin") return v+273.15;
      return v;
    }
    return v / units[type][u];
  };

  useEffect(()=>{
    let v1=parseFloat(value1)||0;
    let v2=parseFloat(value2)||0;

    let b1=convertToBase(v1,unit1);
    let b2=convertToBase(v2,unit2);

    let res;

    if(action==="add") res=convertFromBase(b1+b2,resultUnit);
    else if(action==="subtract") res=convertFromBase(b1-b2,resultUnit);
    else if(action==="multiply") res=convertFromBase(b1*b2,resultUnit);
    else if(action==="divide") res=b2!==0?convertFromBase(b1/b2,resultUnit):"Error";
    else if(action==="compare") res=b1>b2?"Greater":b1<b2?"Less":"Equal";
    else res=convertFromBase(b1,resultUnit);

    setResult(typeof res==="number"?res.toFixed(precision):res);

  },[value1,value2,unit1,unit2,resultUnit,action,type,precision]);

  useEffect(()=>{
    const u=Object.keys(units[type])[0];
    setUnit1(u); setUnit2(u); setResultUnit(u);
  },[type]);

  const unitOptions = Object.keys(units[type]);

  const typeOptions = [
    { value: "length", label: "Length", icon: "straighten" },
    { value: "weight", label: "Weight", icon: "scale" },
    { value: "temperature", label: "Temperature", icon: "thermostat" },
    { value: "volume", label: "Volume", icon: "science" },
    { value: "area", label: "Area", icon: "crop_square" },
  ];

  const actionOptions = [
    { value: "convert", label: "Convert", icon: "transform" },
    { value: "add", label: "Add", icon: "add" },
    { value: "subtract", label: "Subtract", icon: "remove" },
    { value: "multiply", label: "Multiply", icon: "close" },
    { value: "divide", label: "Divide", icon: "horizontal_rule" },
    { value: "compare", label: "Compare", icon: "balance" },
  ];

  const showSecondValue = !["convert"].includes(action);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Unit Converter</h1>
          <p>Professional measurement conversion and calculation tool</p>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <span className="theme-icon">{darkMode ? "light_mode" : "dark_mode"}</span>
        </button>
      </div>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          {/* Type Selection */}
          <div className="sidebar-card">
            <div className="card-header">
              <span className="card-icon">category</span>
              <h3>Measurement Type</h3>
            </div>
            <div className="card-content">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  className={`option-btn ${type === option.value ? 'active' : ''}`}
                  onClick={() => setType(option.value)}
                >
                  <span className="btn-icon">{option.icon}</span>
                  <span className="btn-text">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Selection */}
          <div className="sidebar-card">
            <div className="card-header">
              <span className="card-icon">settings</span>
              <h3>Operation</h3>
            </div>
            <div className="card-content">
              {actionOptions.map((option) => (
                <button
                  key={option.value}
                  className={`option-btn ${action === option.value ? 'active' : ''}`}
                  onClick={() => setAction(option.value)}
                >
                  <span className="btn-icon">{option.icon}</span>
                  <span className="btn-text">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="sidebar-card">
            <div className="card-header">
              <span className="card-icon">tune</span>
              <h3>Settings</h3>
            </div>
            <div className="card-content">
              <div className="setting-group">
                <label className="setting-label">Decimal Places</label>
                <select
                  value={precision}
                  onChange={(e) => setPrecision(Number(e.target.value))}
                  className="setting-select"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {/* Calculator Card */}
          <div className="main-card calculator-card">
            <div className="card-header">
              <span className="card-icon">calculate</span>
              <h3>Calculator</h3>
              <div className="current-selection">
                <span className="selection-badge">
                  {typeOptions.find(t => t.value === type)?.icon} {typeOptions.find(t => t.value === type)?.label}
                </span>
                <span className="selection-badge">
                  {actionOptions.find(a => a.value === action)?.icon} {actionOptions.find(a => a.value === action)?.label}
                </span>
              </div>
            </div>

            <div className="calculator-content">
              <div className="input-section">
                <div className="input-row">
                  <div className="input-field">
                    <label className="input-label">Value 1</label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        value={value1}
                        onChange={(e) => setValue1(e.target.value)}
                        placeholder="0"
                        className="value-input"
                      />
                      <select
                        value={unit1}
                        onChange={(e) => setUnit1(e.target.value)}
                        className="unit-select"
                      >
                        {unitOptions.map((unit) => (
                          <option key={unit} value={unit}>
                            {unitLabels[unit] || unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {showSecondValue && (
                    <>
                      <div className="operator-display">
                        <div className="operator-badge">
                          {action === "add" && "+"}
                          {action === "subtract" && "−"}
                          {action === "multiply" && "×"}
                          {action === "divide" && "÷"}
                          {action === "compare" && "="}
                        </div>
                      </div>

                      <div className="input-field">
                        <label className="input-label">Value 2</label>
                        <div className="input-wrapper">
                          <input
                            type="number"
                            value={value2}
                            onChange={(e) => setValue2(e.target.value)}
                            placeholder="0"
                            className="value-input"
                          />
                          <select
                            value={unit2}
                            onChange={(e) => setUnit2(e.target.value)}
                            className="unit-select"
                          >
                            {unitOptions.map((unit) => (
                              <option key={unit} value={unit}>
                                {unitLabels[unit] || unit}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Result Unit Selection */}
                {["convert", "add", "subtract", "multiply", "divide"].includes(action) && (
                  <div className="result-unit-section">
                    <label className="input-label">Result in</label>
                    <select
                      value={resultUnit}
                      onChange={(e) => setResultUnit(e.target.value)}
                      className="result-unit-select"
                    >
                      {unitOptions.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit} ({unitLabels[unit] || unit})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Result Display */}
              <div className="result-display-section">
                <div className="result-container">
                  <div className="result-label">Result</div>
                  <div className="result-value-display">
                    <span className="result-number">
                      {result || "—"}
                    </span>
                    {result && !isNaN(result) && (
                      <span className="result-unit-display">
                        {unitLabels[resultUnit] || resultUnit}
                      </span>
                    )}
                  </div>
                  {result === "Cannot divide by zero" && (
                    <div className="error-message">
                      <span className="error-icon">error</span>
                      Cannot divide by zero
                    </div>
                  )}
                  {result === "Greater" && <div className="comparison-result greater">Value 1 is Greater</div>}
                  {result === "Less" && <div className="comparison-result less">Value 1 is Less</div>}
                  {result === "Equal" && <div className="comparison-result equal">Values are Equal</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="main-card actions-card">
            <div className="card-header">
              <span className="card-icon">bolt</span>
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions-grid">
              <button
                className="quick-action-btn"
                onClick={() => {
                  setValue1("");
                  setValue2("");
                  setResult("");
                }}
              >
                <span className="action-icon">clear</span>
                <span className="action-text">Clear All</span>
              </button>
              <button
                className="quick-action-btn"
                onClick={() => {
                  const temp = value1;
                  setValue1(value2);
                  setValue2(temp);
                }}
              >
                <span className="action-icon">swap_horiz</span>
                <span className="action-text">Swap Values</span>
              </button>
              <button
                className="quick-action-btn"
                onClick={() => {
                  if (result) {
                    navigator.clipboard?.writeText(result);
                  }
                }}
              >
                <span className="action-icon">content_copy</span>
                <span className="action-text">Copy Result</span>
              </button>
              <button
                className="quick-action-btn"
                onClick={() => {
                  // Reset to defaults
                  setType("length");
                  setAction("convert");
                  setValue1("");
                  setValue2("");
                  setResult("");
                }}
              >
                <span className="action-icon">refresh</span>
                <span className="action-text">Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;