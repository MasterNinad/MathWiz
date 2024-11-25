// Initialize Calculators
document.addEventListener('DOMContentLoaded', () => {
    setupBasicCalculator();
    setupTrigCalculator();
    setupSmoothScroll();
});

// Basic Calculator State
let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

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
        } else if (event.key === 'Escape') {
            event.preventDefault();
            clearDisplay();
        } else if (event.key === 'Backspace') {
            event.preventDefault();
            handleBackspace();
        } else if (['+', '-', '*', '/'].includes(event.key)) {
            event.preventDefault();
            handleOperator(convertOperator(event.key));
        }
        updateBasicDisplay();
    });
}

// Basic Calculator Functions
function inputNumber(number) {
    if (waitingForSecondOperand) {
        displayValue = number;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? number : displayValue + number;
    }
}

function inputDecimal() {
    if (waitingForSecondOperand) {
        displayValue = '0.';
        waitingForSecondOperand = false;
        return;
    }
    if (!displayValue.includes('.')) {
        displayValue += '.';
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        displayValue = `${parseFloat(result.toFixed(7))}`;
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
    switch (operator) {
        case '+': return firstOperand + secondOperand;
        case '-': return firstOperand - secondOperand;
        case '×': return firstOperand * secondOperand;
        case '÷': return firstOperand / secondOperand;
        default: return secondOperand;
    }
}

function handleEquals() {
    if (!operator) return;
    
    const inputValue = parseFloat(displayValue);
    const result = calculate(firstOperand, inputValue, operator);
    displayValue = `${parseFloat(result.toFixed(7))}`;
    firstOperand = result;
    operator = null;
    waitingForSecondOperand = true;
}

function clearDisplay() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

function handleBackspace() {
    if (displayValue.length === 1) {
        displayValue = '0';
    } else {
        displayValue = displayValue.slice(0, -1);
    }
}

function updateBasicDisplay() {
    const display = document.getElementById('basic-result');
    display.value = displayValue;
}

function convertOperator(keyOperator) {
    switch (keyOperator) {
        case '/': return '÷';
        case '*': return '×';
        default: return keyOperator;
    }
}

// Trigonometric Calculator Setup
function setupTrigCalculator() {
    const angleInput = document.getElementById('angle');
    const presetButtons = document.querySelectorAll('.preset-btn');

    // Listen for input changes
    angleInput.addEventListener('input', (e) => {
        const angle = parseFloat(e.target.value) || 0;
        calculateTrig(angle);
    });

    // Listen for preset button clicks
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const angle = parseFloat(button.dataset.angle);
            angleInput.value = angle;
            calculateTrig(angle);
        });
    });

    // Initialize with 0 degrees
    calculateTrig(0);
}

// Calculate Trigonometric Values
function calculateTrig(angle) {
    // Convert angle to radians for calculation
    const radians = angle * Math.PI / 180;
    
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
