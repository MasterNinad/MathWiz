// Initialize Calculators
document.addEventListener('DOMContentLoaded', () => {
    setupBasicCalculator();
    setupTrigCalculator();
    setupSmoothScroll();
});

// Basic Calculator State
let displayValue = '0';
let currentExpression = '';
let waitingForOperand = false;

// Basic Calculator Setup
function setupBasicCalculator() {
    const calculator = document.querySelector('.basic-calc');
    const display = document.getElementById('basic-result');
    display.value = displayValue;

    calculator.addEventListener('click', (event) => {
        if (!event.target.matches('button')) return;
        
        const button = event.target;
        const { type } = button.dataset;
        const buttonValue = button.textContent;

        switch(type) {
            case 'number':
                inputNumber(buttonValue);
                break;
            case 'operator':
                handleOperator(buttonValue);
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
        
        updateBasicDisplay();
    });

    // Keyboard support
    document.addEventListener('keydown', (event) => {
        if (event.key >= '0' && event.key <= '9') {
            event.preventDefault();
            inputNumber(event.key);
        } else if (event.key === '.') {
            event.preventDefault();
            inputDecimal();
        } else if (event.key === '=' || event.key === 'Enter') {
            event.preventDefault();
            handleEquals();
        } else if (event.key === 'Escape' || event.key === 'Delete') {
            event.preventDefault();
            clearDisplay();
        } else if (event.key === 'Backspace') {
            event.preventDefault();
            handleBackspace();
        } else if (['+', '-', '*', '/', '(', ')'].includes(event.key)) {
            event.preventDefault();
            handleOperator(convertOperator(event.key));
        }
        updateBasicDisplay();
    });
}

// Convert keyboard operators to display operators
function convertOperator(keyOperator) {
    switch (keyOperator) {
        case '/': return '÷';
        case '*': return '×';
        case '(': return '(';
        case ')': return ')';
        default: return keyOperator;
    }
}

// Basic Calculator Functions
function inputNumber(number) {
    if (waitingForOperand) {
        displayValue = number;
        waitingForOperand = false;
    } else {
        displayValue = displayValue === '0' ? number : displayValue + number;
    }
    currentExpression = displayValue;
}

function inputDecimal() {
    if (waitingForOperand) {
        displayValue = '0.';
        waitingForOperand = false;
    } else if (!displayValue.includes('.')) {
        displayValue += '.';
    }
    currentExpression = displayValue;
}

function handleOperator(nextOperator) {
    // Handle parentheses
    if (nextOperator === '(' || nextOperator === ')') {
        if (displayValue === '0' && nextOperator === '(') {
            currentExpression = nextOperator;
        } else {
            currentExpression += nextOperator;
        }
        displayValue = currentExpression;
        return;
    }

    // Remove trailing operator if exists
    if (['+', '-', '×', '÷'].includes(currentExpression.slice(-1))) {
        currentExpression = currentExpression.slice(0, -1);
    }

    // Add the new operator
    currentExpression += ` ${nextOperator} `;
    displayValue = currentExpression;
    waitingForOperand = false;
}

function handleEquals() {
    try {
        // Replace × and ÷ with * and / for evaluation
        let expression = currentExpression
            .replace(/×/g, '*')
            .replace(/÷/g, '/');
        
        // Evaluate the expression
        const result = Function('"use strict";return (' + expression + ')')();
        
        // Format the result
        displayValue = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, '');
        currentExpression = displayValue;
        waitingForOperand = true;
    } catch (error) {
        displayValue = 'Error';
        currentExpression = '';
        waitingForOperand = true;
    }
}

function clearDisplay() {
    displayValue = '0';
    currentExpression = '';
    waitingForOperand = false;
}

function handleDelete() {
    displayValue = '0';
    currentExpression = '';
    waitingForOperand = false;
}

function handleBackspace() {
    if (displayValue === '0' || displayValue.length === 1) {
        displayValue = '0';
        currentExpression = '';
    } else {
        // Check if we're deleting an operator (which has spaces around it)
        const lastChar = currentExpression.trim().slice(-1);
        if (['+', '-', '×', '÷', '(', ')'].includes(lastChar)) {
            // Remove the operator and surrounding spaces
            currentExpression = currentExpression.slice(0, -3).trim();
        } else {
            // Remove just the last character
            currentExpression = currentExpression.slice(0, -1).trim();
        }
        displayValue = currentExpression || '0';
    }
    waitingForOperand = false;
    updateBasicDisplay();
}

function updateBasicDisplay() {
    const display = document.getElementById('basic-result');
    display.value = displayValue;
}

// Trigonometric Calculator Setup
function setupTrigCalculator() {
    const angleInput = document.getElementById('angle');
    const angleUnit = document.getElementById('angle-unit');
    const unitLabel = document.querySelector('.unit-label');
    const presetButtons = document.querySelectorAll('.preset-btn');

    // Listen for input changes
    angleInput.addEventListener('input', (e) => {
        const angle = parseFloat(e.target.value) || 0;
        calculateTrig(angle, !angleUnit.checked);
    });

    // Listen for unit toggle changes
    angleUnit.addEventListener('change', (e) => {
        const angle = parseFloat(angleInput.value) || 0;
        unitLabel.textContent = e.target.checked ? 'RAD' : 'DEG';
        
        // Convert the current value between degrees and radians
        if (e.target.checked) {
            // Converting from degrees to radians
            angleInput.value = (angle * Math.PI / 180).toFixed(4);
        } else {
            // Converting from radians to degrees
            angleInput.value = (angle * 180 / Math.PI).toFixed(4);
        }
        
        calculateTrig(parseFloat(angleInput.value), !e.target.checked);
    });

    // Listen for preset button clicks (presets are always in degrees)
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const angleDeg = parseFloat(button.dataset.angle);
            if (angleUnit.checked) {
                // If in radians mode, convert the preset degree value to radians
                angleInput.value = (angleDeg * Math.PI / 180).toFixed(4);
            } else {
                angleInput.value = angleDeg;
            }
            calculateTrig(parseFloat(angleInput.value), !angleUnit.checked);
        });
    });

    // Initialize with 0
    calculateTrig(0, true);
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

    // Format values to 6 decimal places
    const formatValue = (value) => {
        if (isNaN(value) || !isFinite(value)) return 'undefined';
        return value.toFixed(6);
    };

    // Update display
    document.getElementById('sin-result').value = formatValue(sinValue);
    document.getElementById('cos-result').value = formatValue(cosValue);
    document.getElementById('tan-result').value = formatValue(tanValue);
    document.getElementById('cot-result').value = formatValue(cotValue);
    document.getElementById('sec-result').value = formatValue(secValue);
    document.getElementById('cosec-result').value = formatValue(cosecValue);
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
