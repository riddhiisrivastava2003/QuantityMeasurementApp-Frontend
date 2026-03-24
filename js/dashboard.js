let currentAction = "compare";
let currentType = "";

const value1Input = document.getElementById("value1");
const value2Input = document.getElementById("value2");
const unit1Select = document.getElementById("unit1");
const unit2Select = document.getElementById("unit2");
const resultUnitSelect = document.getElementById("result-unit");
const resultOutput = document.getElementById("result");
const actionSymbol = document.getElementById("action-symbol");
const resultUnitWrapper = document.getElementById("result-unit-wrapper");
const activeTypeLabel = document.getElementById("active-type");
const activeActionLabel = document.getElementById("active-action");
const metaTypeCard = document.getElementById("meta-type");
const metaActionCard = document.getElementById("meta-action");

const units = {
    length: {
        base: 'meter',
        meter: 1,
        kilometer: 1000,
        centimeter: 0.01,
        inch: 0.0254,
        feet: 0.3048
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
        fahrenheit: 1, // Conversion is handled differently
    },
    volume: {
        base: 'litre',
        litre: 1,
        millilitre: 0.001,
        gallon: 3.78541,
    }
};

document.addEventListener('DOMContentLoaded', () => {
    value1Input.addEventListener('input', calculate);
    value2Input.addEventListener('input', calculate);
    unit1Select.addEventListener('change', calculate);
    unit2Select.addEventListener('change', calculate);
    resultUnitSelect.addEventListener('change', calculate);
    
    document.getElementById('action-group').children[0].click();
    document.getElementById('type-group').children[0].click();
});

const themeToggle = document.getElementById('themeToggle');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
    localStorage.setItem('theme', theme);
}

const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(storedTheme || (prefersDark ? 'dark' : 'light'));

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(next);
    });
}

function setAction(element, action) {
    currentAction = action;

    const actionButtons = document.getElementById('action-group').children;
    for (let button of actionButtons) {
        button.classList.remove('active');
    }
    element.classList.add('active');

    resultUnitWrapper.style.display = 'none';

    if (action === 'arithmetic') {
        actionSymbol.innerText = '+';
        value2Input.style.display = 'flex';
        resultUnitWrapper.style.display = 'block';
    } else if (action === 'convert') {
        actionSymbol.innerText = '->';
        value2Input.style.display = 'none';
        resultUnitWrapper.style.display = 'block';
    } else { // compare
        actionSymbol.innerText = '==';
        value2Input.style.display = 'flex';
    }
    updateMeta();
    calculate();
}

function selectType(element, type) {
    currentType = type;

    const typeButtons = document.getElementById('type-group').children;
    for (let button of typeButtons) {
        button.classList.remove('active');
    }
    element.classList.add('active');

    // Populate unit dropdowns
    const unitOptions = Object.keys(units[type]).filter(u => u !== 'base').map(unit => `<option value="${unit}">${unit}</option>`).join('');
    unit1Select.innerHTML = unitOptions;
    unit2Select.innerHTML = unitOptions;
    resultUnitSelect.innerHTML = unitOptions;

    updateMeta();
    calculate();
}

function updateMeta() {
    const actionMap = {
        compare: "Comparison",
        convert: "Conversion",
        arithmetic: "Arithmetic"
    };
    const typeMap = {
        length: "Length",
        weight: "Weight",
        temp: "Temperature",
        volume: "Volume"
    };

    if (activeTypeLabel) activeTypeLabel.innerText = typeMap[currentType] || "-";
    if (activeActionLabel) activeActionLabel.innerText = actionMap[currentAction] || "-";

    if (metaTypeCard) {
        metaTypeCard.classList.remove("pulse");
        void metaTypeCard.offsetWidth;
        metaTypeCard.classList.add("pulse");
    }

    if (metaActionCard) {
        metaActionCard.classList.remove("pulse");
        void metaActionCard.offsetWidth;
        metaActionCard.classList.add("pulse");
    }
}

function convertToBase(value, unit, type) {
    if (type === 'temp' && unit !== units[type].base) {
        if (unit === 'fahrenheit') return (value - 32) * 5 / 9;
    }
    return value * units[type][unit];
}

function convertFromBase(value, unit, type) {
    if (type === 'temp' && unit !== units[type].base) {
        if (unit === 'fahrenheit') return (value * 9 / 5) + 32;
    }
    return value / units[type][unit];
}

function calculate() {
    if (!currentType) return;

    let v1 = parseFloat(value1Input.value) || 0;
    let v2 = parseFloat(value2Input.value) || 0;

    let u1 = unit1Select.value;
    let u2 = unit2Select.value;
    let resultUnit = resultUnitSelect.value;

    let baseV1 = convertToBase(v1, u1, currentType);
    let baseV2 = convertToBase(v2, u2, currentType);
    
    let resultValue;

    if (currentAction === "arithmetic") {
        let rawResult = baseV1 + baseV2;
        resultValue = convertFromBase(rawResult, resultUnit, currentType);
    } else if (currentAction === "compare") {
        resultValue = baseV1 === baseV2 ? "Equal" : "Not Equal";
    } else if (currentAction === "convert") {
        resultValue = convertFromBase(baseV1, resultUnit, currentType);
    }
    
    if (typeof resultValue === 'number') {
        resultOutput.innerText = resultValue.toFixed(2);
    } else {
        resultOutput.innerText = resultValue;
    }
}