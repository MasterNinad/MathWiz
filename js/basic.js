// Basic Calculator State
const calculatorState = {
    expression: '',
    currentNumber: '0',
    lastInputWasOperator: false,
    calculated: false,
    openBrackets: 0
};

// Basic Calculator Setup
function setupBasicCalculator() {
    const calculator = document.querySelector('.basic-calc');
    const display = document.getElementById('basic-result');
    
    // Set initial display
    updateDisplay();

    // Add click event listener to calculator buttons
    calculator.addEventListener('click', event => {
        const target = event.target;
        
        if (!target.matches('button')) {
            return;
        }

        const { type } = target.dataset;
        const { textContent } = target;

        switch (type) {
            case 'number':
                inputDigit(textContent);
                break;
            case 'operator':
                inputOperator(textContent);
                break;
            case 'decimal':
                inputDecimal();
                break;
            case 'clear':
                resetCalculator();
                break;
            case 'backspace':
                handleBackspace();
                break;
            case 'equals':
                calculateResult();
                break;
            case 'bracket':
                inputBracket(textContent);
                break;
        }

        updateDisplay();
    });

    // Add keyboard support
    document.addEventListener('keydown', handleKeyboardInput);
}

// Handle keyboard input
function handleKeyboardInput(event) {
    const key = event.key;

    // Only handle keyboard input if basic calculator is active
    const display = document.getElementById('basic-result');
    if (!display) return;

    // Prevent default behavior for calculator keys
    if (isCalculatorKey(key)) {
        event.preventDefault();
    }

    // Handle numeric input
    if (/^\d$/.test(key)) {
        inputDigit(key);
    }
    // Handle operators
    else if (['+', '-', '*', '/', '×', '÷'].includes(key)) {
        const operatorMap = { '*': '×', '/': '÷' };
        inputOperator(operatorMap[key] || key);
    }
    // Handle brackets
    else if (key === '(' || key === ')') {
        inputBracket(key);
    }
    // Handle decimal point
    else if (key === '.') {
        inputDecimal();
    }
    // Handle equals and enter
    else if (key === '=' || key === 'Enter') {
        calculateResult();
    }
    // Handle clear
    else if (key === 'Escape' || key === 'Delete') {
        resetCalculator();
    }
    // Handle backspace
    else if (key === 'Backspace') {
        handleBackspace();
    }

    updateDisplay();
}

// Input digit
function inputDigit(digit) {
    if (calculatorState.calculated) {
        resetCalculator();
    }

    if (calculatorState.lastInputWasOperator) {
        calculatorState.currentNumber = digit;
        calculatorState.lastInputWasOperator = false;
    } else {
        calculatorState.currentNumber = calculatorState.currentNumber === '0' ? 
            digit : calculatorState.currentNumber + digit;
    }
}

// Input decimal
function inputDecimal() {
    if (calculatorState.calculated) {
        resetCalculator();
    }

    if (calculatorState.lastInputWasOperator) {
        calculatorState.currentNumber = '0.';
        calculatorState.lastInputWasOperator = false;
    } else if (!calculatorState.currentNumber.includes('.')) {
        calculatorState.currentNumber += '.';
    }
}

// Input bracket
function inputBracket(bracket) {
    if (calculatorState.calculated) {
        resetCalculator();
    }

    if (bracket === '(') {
        // Add multiplication operator if needed
        if (!calculatorState.lastInputWasOperator && 
            calculatorState.currentNumber !== '0' && 
            calculatorState.currentNumber !== '') {
            inputOperator('×');
        }
        calculatorState.openBrackets++;
        calculatorState.expression += (calculatorState.expression ? ' ' : '') + '(';
        calculatorState.currentNumber = '';
        calculatorState.lastInputWasOperator = true;
    } else if (bracket === ')' && calculatorState.openBrackets > 0) {
        if (!calculatorState.lastInputWasOperator) {
            calculatorState.expression += (calculatorState.expression ? ' ' : '') + 
                calculatorState.currentNumber + ' )';
            calculatorState.currentNumber = '';
        } else {
            calculatorState.expression = calculatorState.expression.slice(0, -1) + ')';
        }
        calculatorState.openBrackets--;
        calculatorState.lastInputWasOperator = false;
    }
}

// Input operator
function inputOperator(operator) {
    if (calculatorState.calculated) {
        calculatorState.expression = calculatorState.currentNumber;
        calculatorState.calculated = false;
    }

    if (!calculatorState.lastInputWasOperator) {
        calculatorState.expression += (calculatorState.expression ? ' ' : '') + 
            calculatorState.currentNumber + ' ' + operator;
        calculatorState.lastInputWasOperator = true;
    } else if (operator === '-' && 
        (calculatorState.expression.endsWith('(') || !calculatorState.expression)) {
        // Allow negative numbers after opening bracket or at start
        calculatorState.currentNumber = '-';
        calculatorState.lastInputWasOperator = false;
    } else {
        // Replace the last operator
        calculatorState.expression = calculatorState.expression.slice(0, -1) + operator;
    }
}

// Calculate result
function calculateResult() {
    if (!calculatorState.expression && calculatorState.currentNumber === '0' || 
        calculatorState.calculated) return;

    let finalExpression = calculatorState.expression;
    if (!calculatorState.lastInputWasOperator) {
        finalExpression += (finalExpression ? ' ' : '') + calculatorState.currentNumber;
    } else {
        finalExpression = finalExpression.slice(0, -2); // Remove trailing operator
    }

    // Add missing closing brackets
    while (calculatorState.openBrackets > 0) {
        finalExpression += ' )';
        calculatorState.openBrackets--;
    }

    try {
        const result = evaluateExpression(finalExpression);
        calculatorState.currentNumber = formatResult(result);
        calculatorState.expression = '';
        calculatorState.calculated = true;
        calculatorState.lastInputWasOperator = false;
        calculatorState.openBrackets = 0;
    } catch (error) {
        calculatorState.currentNumber = 'Error';
        calculatorState.expression = '';
        calculatorState.calculated = true;
        calculatorState.openBrackets = 0;
    }
}

// Handle backspace
function handleBackspace() {
    if (calculatorState.calculated) {
        resetCalculator();
        return;
    }

    if (calculatorState.lastInputWasOperator) {
        // Remove the operator and space
        calculatorState.expression = calculatorState.expression.slice(0, -2);
        const parts = calculatorState.expression.split(' ');
        calculatorState.currentNumber = parts[parts.length - 1] || '0';
        calculatorState.lastInputWasOperator = false;
    } else {
        calculatorState.currentNumber = calculatorState.currentNumber.slice(0, -1);
        if (!calculatorState.currentNumber) {
            calculatorState.currentNumber = '0';
        }
    }
}

// Reset calculator
function resetCalculator() {
    calculatorState.expression = '';
    calculatorState.currentNumber = '0';
    calculatorState.lastInputWasOperator = false;
    calculatorState.calculated = false;
    calculatorState.openBrackets = 0;
}

// Evaluate expression
function evaluateExpression(expression) {
    // First, split the expression into tokens
    const tokens = expression.split(' ').filter(token => token !== '');
    
    // Convert infix notation to postfix (Reverse Polish Notation)
    const postfix = infixToPostfix(tokens);
    
    // Evaluate the postfix expression
    return evaluatePostfix(postfix);
}

// Convert infix expression to postfix notation
function infixToPostfix(tokens) {
    const output = [];
    const operators = [];
    const precedence = {
        '+': 1,
        '-': 1,
        '×': 2,
        '÷': 2
    };

    for (let token of tokens) {
        if (!isNaN(token)) {
            // If token is a number
            output.push(parseFloat(token));
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                output.push(operators.pop());
            }
            operators.pop(); // Remove '('
        } else {
            // Token is an operator
            while (operators.length > 0 && 
                   operators[operators.length - 1] !== '(' && 
                   precedence[operators[operators.length - 1]] >= precedence[token]) {
                output.push(operators.pop());
            }
            operators.push(token);
        }
    }

    // Pop remaining operators
    while (operators.length > 0) {
        output.push(operators.pop());
    }

    return output;
}

// Evaluate postfix expression
function evaluatePostfix(postfix) {
    const stack = [];

    for (let token of postfix) {
        if (typeof token === 'number') {
            stack.push(token);
        } else {
            const b = stack.pop();
            const a = stack.pop();
            
            switch (token) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '×':
                    stack.push(a * b);
                    break;
                case '÷':
                    if (b === 0) throw new Error('Division by zero');
                    stack.push(a / b);
                    break;
                default:
                    throw new Error('Invalid operator');
            }
        }
    }

    return stack[0];
}

// Update display
function updateDisplay() {
    const display = document.getElementById('basic-result');
    if (display) {
        let displayText = calculatorState.expression;
        if (!calculatorState.lastInputWasOperator) {
            displayText += (displayText ? ' ' : '') + calculatorState.currentNumber;
        }
        display.value = displayText || calculatorState.currentNumber;
    }
}

// Check if key is a calculator key
function isCalculatorKey(key) {
    return /[\d+\-*/.=Enter]/.test(key);
}

// Format result
function formatResult(value) {
    if (typeof value !== 'number' || !isFinite(value)) return 'Error';
    
    // Convert to string and check for exponential notation
    const stringValue = value.toString();
    if (stringValue.includes('e')) {
        return value.toExponential(6);
    }
    
    // Handle regular numbers
    if (Math.abs(value) >= 1e9 || (Math.abs(value) < 1e-6 && value !== 0)) {
        return value.toExponential(6);
    }
    
    // Remove trailing zeros after decimal point
    return Number(value.toFixed(8)).toString();
}
