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



// Format number with Indian number system (e.g., 1,00,000)

function formatIndianNumber(number) {

    return new Intl.NumberFormat('en-IN').format(number);

}

