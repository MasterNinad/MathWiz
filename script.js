// Calculator State and Constants
const OPERATORS = {
    '+': '+',
    '-': '-',
    '*': '×',
    '/': '÷',
    '(': '(',
    ')': ')'
};

const CALCULATOR_STATE = {
    displayValue: '0',
    currentExpression: '',
    waitingForOperand: false
};

// Initialize the appropriate calculator based on the page
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'basic.html':
            setupBasicCalculator();
            break;
        case 'trig.html':
            setupTrigCalculator();
            break;
        case 'financial.html':
            setupFinancialCalculator();
            break;
        case 'index.html':
        case '':
            // No initialization needed for landing page
            break;
    }
});

// Basic Calculator Setup
function setupBasicCalculator() {
    const calculator = document.querySelector('.basic-calc');
    const display = document.getElementById('basic-result');
    updateDisplay();

    // Button click handler
    calculator.addEventListener('click', handleCalculatorClick);
    
    // Keyboard support - only when basic calculator is focused
    document.addEventListener('keydown', (event) => {
        const basicResult = document.getElementById('basic-result');
        // Only handle keyboard input if basic calculator display is focused
        if (document.activeElement !== basicResult) return;

        const key = event.key;
        let type = '', value = '';

        if (key >= '0' && key <= '9') {
            type = 'number';
            value = key;
        } else if (key === '.') {
            type = 'decimal';
            value = key;
        } else if (key === '=' || key === 'Enter') {
            type = 'equals';
            value = '=';
        } else if (key === 'Escape' || key === 'Delete') {
            type = 'clear';
            value = 'C';
        } else if (key === 'Backspace') {
            type = 'backspace';
            value = '⌫';
        } else if (Object.keys(OPERATORS).includes(key)) {
            type = 'operator';
            value = OPERATORS[key];
        } else {
            return;
        }

        event.preventDefault();
        handleInput(type, value);
    });
}

// Event Handlers
function handleCalculatorClick(event) {
    if (!event.target.matches('button')) return;
    
    const button = event.target;
    const { type } = button.dataset;
    const value = button.textContent;

    handleInput(type, value);
}

function handleKeyboardInput(event) {
    const key = event.key;
    let type = '', value = '';

    if (key >= '0' && key <= '9') {
        type = 'number';
        value = key;
    } else if (key === '.') {
        type = 'decimal';
        value = key;
    } else if (key === '=' || key === 'Enter') {
        type = 'equals';
        value = '=';
    } else if (key === 'Escape' || key === 'Delete') {
        type = 'clear';
        value = 'C';
    } else if (key === 'Backspace') {
        type = 'backspace';
        value = '⌫';
    } else if (Object.keys(OPERATORS).includes(key)) {
        type = 'operator';
        value = OPERATORS[key];
    } else {
        return;
    }

    event.preventDefault();
    handleInput(type, value);
}

// Input Handler
function handleInput(type, value) {
    switch(type) {
        case 'number':
            inputNumber(value);
            break;
        case 'operator':
            handleOperator(value);
            break;
        case 'decimal':
            inputDecimal();
            break;
        case 'equals':
            handleEquals();
            break;
        case 'clear':
            clearDisplay();
            break;
        case 'backspace':
            handleBackspace();
            break;
    }
    
    updateDisplay();
}

// Calculator Functions
function inputNumber(number) {
    const { displayValue, waitingForOperand } = CALCULATOR_STATE;
    
    if (waitingForOperand) {
        CALCULATOR_STATE.displayValue = number;
        CALCULATOR_STATE.waitingForOperand = false;
    } else {
        CALCULATOR_STATE.displayValue = displayValue === '0' ? number : displayValue + number;
    }
    CALCULATOR_STATE.currentExpression = CALCULATOR_STATE.displayValue;
}

function inputDecimal() {
    const { currentExpression, waitingForOperand, displayValue } = CALCULATOR_STATE;
    const parts = currentExpression.split(' ');
    const lastPart = parts[parts.length - 1];

    if (waitingForOperand || displayValue === '0') {
        CALCULATOR_STATE.currentExpression = currentExpression === '0' ? '0.' : currentExpression + '0.';
        CALCULATOR_STATE.displayValue = CALCULATOR_STATE.currentExpression;
        CALCULATOR_STATE.waitingForOperand = false;
        return;
    }

    if (isOperator(lastPart) || lastPart.includes('.')) return;

    CALCULATOR_STATE.currentExpression += '.';
    CALCULATOR_STATE.displayValue = CALCULATOR_STATE.currentExpression;
    CALCULATOR_STATE.waitingForOperand = false;
}

function handleOperator(operator) {
    const { currentExpression } = CALCULATOR_STATE;

    if (operator === '(' || operator === ')') {
        if (CALCULATOR_STATE.displayValue === '0' && operator === '(') {
            CALCULATOR_STATE.currentExpression = operator;
        } else {
            CALCULATOR_STATE.currentExpression += operator;
        }
        CALCULATOR_STATE.displayValue = CALCULATOR_STATE.currentExpression;
        return;
    }

    // Remove trailing operator if exists
    if (isOperator(currentExpression.trim().slice(-1))) {
        CALCULATOR_STATE.currentExpression = currentExpression.trim().slice(0, -3);
    }

    CALCULATOR_STATE.currentExpression += ` ${operator} `;
    CALCULATOR_STATE.displayValue = CALCULATOR_STATE.currentExpression;
    CALCULATOR_STATE.waitingForOperand = false;
}

function handleEquals() {
    try {
        const expression = CALCULATOR_STATE.currentExpression
            .replace(/×/g, '*')
            .replace(/÷/g, '/');
        
        const result = Function('"use strict";return (' + expression + ')')();
        CALCULATOR_STATE.displayValue = formatResult(result);
        CALCULATOR_STATE.currentExpression = CALCULATOR_STATE.displayValue;
        CALCULATOR_STATE.waitingForOperand = true;
    } catch (error) {
        CALCULATOR_STATE.displayValue = 'Error';
        CALCULATOR_STATE.currentExpression = '';
        CALCULATOR_STATE.waitingForOperand = true;
    }
}

function handleBackspace() {
    const { displayValue, currentExpression } = CALCULATOR_STATE;

    if (displayValue === '0' || displayValue.length === 1) {
        resetCalculator();
        return;
    }

    const lastChar = currentExpression.trim().slice(-1);
    if (isOperator(lastChar)) {
        CALCULATOR_STATE.currentExpression = currentExpression.slice(0, -3).trim();
    } else {
        CALCULATOR_STATE.currentExpression = currentExpression.slice(0, -1).trim();
    }
    
    CALCULATOR_STATE.displayValue = CALCULATOR_STATE.currentExpression || '0';
    CALCULATOR_STATE.waitingForOperand = false;
}

// Utility Functions
function isOperator(char) {
    return Object.values(OPERATORS).includes(char);
}

function formatResult(result) {
    return Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, '');
}

function resetCalculator() {
    CALCULATOR_STATE.displayValue = '0';
    CALCULATOR_STATE.currentExpression = '';
    CALCULATOR_STATE.waitingForOperand = false;
}

function clearDisplay() {
    resetCalculator();
}

function updateDisplay() {
    document.getElementById('basic-result').value = CALCULATOR_STATE.displayValue;
}

// Trigonometric Calculator Setup
function setupTrigCalculator() {
    const angleInput = document.getElementById('angle');
    const angleUnit = document.getElementById('angle-unit');
    const unitLabel = document.querySelector('.unit-label');
    const presetButtons = document.querySelectorAll('.preset-btn');

    // Add keyboard support for trigonometric calculator
    angleInput.addEventListener('keydown', handleTrigKeyboard);

    // Listen for input changes
    angleInput.addEventListener('input', (e) => {
        const angle = parseFloat(e.target.value) || 0;
        calculateTrig(angle, !angleUnit.checked);
    });

    // Listen for unit toggle changes
    angleUnit.addEventListener('change', (e) => {
        const angle = parseFloat(angleInput.value) || 0;
        unitLabel.textContent = e.target.checked ? 'RAD' : 'DEG';
        
        if (e.target.checked) {
            angleInput.value = formatResult(angle * Math.PI / 180);
        } else {
            angleInput.value = formatResult(angle * 180 / Math.PI);
        }
        
        calculateTrig(parseFloat(angleInput.value), !e.target.checked);
    });

    // Listen for preset button clicks
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const angleDeg = parseFloat(button.dataset.angle);
            if (angleUnit.checked) {
                angleInput.value = formatResult(angleDeg * Math.PI / 180);
            } else {
                angleInput.value = angleDeg;
            }
            calculateTrig(parseFloat(angleInput.value), !angleUnit.checked);
        });
    });

    // Add keyboard shortcuts for unit toggle
    document.addEventListener('keydown', (event) => {
        if (document.activeElement === angleInput) {
            if (event.key.toLowerCase() === 'd') {
                event.preventDefault();
                angleUnit.checked = false;
                angleUnit.dispatchEvent(new Event('change'));
            } else if (event.key.toLowerCase() === 'r') {
                event.preventDefault();
                angleUnit.checked = true;
                angleUnit.dispatchEvent(new Event('change'));
            }
        }
    });

    // Initialize with 0
    calculateTrig(0, true);
}

// Handle keyboard input for trigonometric calculator
function handleTrigKeyboard(event) {
    const key = event.key;
    const input = event.target;
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    
    // Handle keyboard shortcuts
    if (event.ctrlKey || event.metaKey) {
        if (['c', 'x', 'v'].includes(key.toLowerCase())) {
            return;
        }
    }

    // Handle negative numbers
    if (key === '-') {
        if (input.selectionStart === 0 && !input.value.includes('-')) {
            return;
        }
        event.preventDefault();
        return;
    }

    // Block any other keys
    if (!allowedKeys.includes(key)) {
        event.preventDefault();
        return;
    }

    // Handle decimal point
    if (key === '.') {
        if (input.value.includes('.')) {
            event.preventDefault();
            return;
        }
    }

    // Handle delete and backspace
    if (key === 'Delete' || key === 'Backspace') {
        setTimeout(() => {
            const newValue = parseFloat(input.value) || 0;
            calculateTrig(newValue, !document.getElementById('angle-unit').checked);
        }, 0);
        return;
    }

    // After any valid key press, calculate new value
    setTimeout(() => {
        const newValue = parseFloat(input.value) || 0;
        calculateTrig(newValue, !document.getElementById('angle-unit').checked);
    }, 0);
}

// Calculate Trigonometric Values
function calculateTrig(angle, isDegrees) {
    // Convert to radians if input is in degrees
    const radians = isDegrees ? angle * Math.PI / 180 : angle;
    
    // Calculate primary functions
    const sinValue = Math.sin(radians);
    const cosValue = Math.cos(radians);
    const tanValue = Math.tan(radians);

    // Calculate reciprocal functions
    const cotValue = 1 / tanValue;
    const secValue = 1 / cosValue;
    const cosecValue = 1 / sinValue;

    // Update display with formatted values
    updateTrigDisplay('sin-result', sinValue);
    updateTrigDisplay('cos-result', cosValue);
    updateTrigDisplay('tan-result', tanValue);
    updateTrigDisplay('cot-result', cotValue);
    updateTrigDisplay('sec-result', secValue);
    updateTrigDisplay('cosec-result', cosecValue);
}

// Update trigonometric display with formatted value
function updateTrigDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (isNaN(value) || !isFinite(value)) {
        element.value = 'undefined';
    } else {
        element.value = formatResult(value);
    }
}

// Financial Calculator Setup
function setupFinancialCalculator() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const compoundInputs = document.querySelector('.compound-only');
    const principalInput = document.getElementById('principal');
    const rateInput = document.getElementById('rate');
    const timeInput = document.getElementById('time');
    const timeUnitSelect = document.getElementById('time-unit');
    const frequencySelect = document.getElementById('frequency');
    const presetBtns = document.querySelectorAll('.preset-btn');

    // Handle time unit changes
    timeUnitSelect.addEventListener('change', calculateInterest);

    // Handle frequency changes
    frequencySelect.addEventListener('change', calculateInterest);

    // Handle principal input formatting
    principalInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value) {
            const number = parseInt(value);
            e.target.value = formatIndianNumber(number);
        } else {
            e.target.value = '';
        }
        calculateInterest();
    });

    // Handle rate input (allow decimals)
    rateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9.]/g, '');
        // Allow only one decimal point
        const decimalCount = (value.match(/\./g) || []).length;
        if (decimalCount > 1) {
            value = value.replace(/\./g, (match, index) => index === value.indexOf('.') ? match : '');
        }
        e.target.value = value;
        calculateInterest();
    });

    // Handle time input formatting
    timeInput.addEventListener('input', function(e) {
        let value = e.target.value;
        
        // Only allow numbers and one decimal point
        value = value.replace(/[^\d.]/g, '');
        
        // Ensure only one decimal point
        let decimalCount = (value.match(/\./g) || []).length;
        if (decimalCount > 1) {
            const parts = value.split('.');
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        // Limit to 2 decimal places
        if (value.includes('.')) {
            const parts = value.split('.');
            if (parts[1].length > 2) {
                value = parts[0] + '.' + parts[1].slice(0, 2);
            }
        }
        
        e.target.value = value;
        calculateInterest();
    });

    // Toggle between simple and compound interest
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.dataset.type === 'compound') {
                compoundInputs.style.display = 'block';
            } else {
                compoundInputs.style.display = 'none';
            }
            
            calculateInterest();
        });
    });

    // Preset amount buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseInt(btn.dataset.amount);
            principalInput.value = formatIndianNumber(amount);
            calculateInterest();
        });
    });

    // Initial calculation
    calculateInterest();
}

// Format number with Indian number system (e.g., 1,00,000)
function formatIndianNumber(number) {
    return new Intl.NumberFormat('en-IN').format(number);
}

// Calculate Interest
function calculateInterest() {
    // Remove commas and convert to number
    const principal = parseFloat(document.getElementById('principal').value.replace(/,/g, '')) || 0;
    const rate = parseFloat(document.getElementById('rate').value) || 0;
    const time = parseFloat(document.getElementById('time').value) || 0;
    const timeUnit = document.getElementById('time-unit').value;
    const isCompound = document.querySelector('.toggle-btn.active').dataset.type === 'compound';
    
    let timeInYears = time;
    if (timeUnit === 'months') {
        timeInYears = time / 12;
    }

    let interest = 0;
    let total = 0;

    if (isCompound) {
        const frequency = parseInt(document.getElementById('frequency').value);
        // Compound Interest: A = P(1 + r/n)^(nt)
        const rateDecimal = rate / 100;
        total = principal * Math.pow(1 + (rateDecimal / frequency), frequency * timeInYears);
        interest = total - principal;
    } else {
        // Simple Interest: I = P * r * t
        interest = principal * (rate / 100) * timeInYears;
        total = principal + interest;
    }

    // Format and display results with Indian number formatting
    document.getElementById('interest-result').value = formatCurrency(interest);
    document.getElementById('total-result').value = formatCurrency(total);
}

// Format currency with Indian Rupee symbol and number formatting
function formatCurrency(value) {
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return formatter.format(value);
}

// Smooth Scrolling
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}
