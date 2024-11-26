// Common utility functions and initialization for MathWiz Calculator Suite

// Initialize all calculators when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the appropriate calculator based on the page
    if (document.querySelector('.basic-calc')) {
        setupBasicCalculator();
    }
    if (document.querySelector('.trig-calc')) {
        setupTrigCalculator();
    }
    if (document.querySelector('.financial-calc')) {
        setupFinancialCalculator();
    }
});

// Common operators object used across calculators
const OPERATORS = {
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '/',
    'Enter': '=',
    '=': '='
};

// Common utility functions
function formatResult(value) {
    // Handle special cases
    if (typeof value !== 'number' || !isFinite(value)) {
        return 'Error';
    }
    
    // Convert to number and fix precision
    const numValue = Number(value);
    
    // Handle very small numbers close to zero
    if (Math.abs(numValue) < 1e-10) {
        return '0';
    }
    
    // Handle very large or very small numbers
    if (Math.abs(numValue) >= 1e9 || Math.abs(numValue) < 1e-6) {
        return numValue.toExponential(6);
    }
    
    // Regular number formatting
    return numValue.toFixed(6).replace(/\.?0+$/, '');
}

// Error handling function
function handleCalculationError(error) {
    console.error('Calculation error:', error);
    return 'Error';
}

// Perform basic arithmetic calculations
function performCalculation(operator, firstOperand, secondOperand) {
    try {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '*':
                return firstOperand * secondOperand;
            case '/':
                if (secondOperand === 0) {
                    throw new Error('Division by zero');
                }
                return firstOperand / secondOperand;
            default:
                throw new Error('Invalid operator');
        }
    } catch (error) {
        return handleCalculationError(error);
    }
}
