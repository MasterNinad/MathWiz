// Matrix Calculator JavaScript

// Current operation
let currentOperation = 'add';

// Initialize the calculator when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeCalculator);

// Initialize the calculator
function initializeCalculator() {
    setupEventListeners();
    updateMatrixGrids(); // Initial matrix setup
}

// Setup all event listeners
function setupEventListeners() {
    setupOperationButtons();
    setupSizeInputs();
    setupCalculateButton();
}

// Set up operation buttons
function setupOperationButtons() {
    const operationButtons = document.querySelectorAll('.operation-btn');
    operationButtons.forEach(button => {
        button.addEventListener('click', () => handleOperationButtonClick(button, operationButtons));
    });
}

// Handle operation button click
function handleOperationButtonClick(button, operationButtons) {
    // Update active button
    operationButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update current operation
    currentOperation = button.dataset.operation;
    updateOperationSymbol();
    toggleMatrixBVisibility();
}

// Toggle visibility of Matrix B based on operation
function toggleMatrixBVisibility() {
    const matrixB = document.querySelector('.matrix-b');
    const matrixBSize = document.querySelector('.matrix-b-size');
    const singleMatrixOps = ['determinant', 'inverse', 'transpose'];
    const displayStyle = singleMatrixOps.includes(currentOperation) ? 'none' : 'block';
    matrixB.style.display = displayStyle;
    matrixBSize.style.display = displayStyle;
}

// Update operation symbol between matrices
function updateOperationSymbol() {
    const symbol = document.querySelector('.operation-symbol');
    const symbols = { 'add': '+', 'subtract': '-', 'multiply': '×' };
    symbol.textContent = symbols[currentOperation] || '';
}

// Set up size input handlers
function setupSizeInputs() {
    const sizeInputs = document.querySelectorAll('.size-inputs input');
    sizeInputs.forEach(input => input.addEventListener('change', updateMatrixGrids));
}

// Update matrix grids based on size inputs
function updateMatrixGrids() {
    const matrixARows = parseInt(document.getElementById('matrix-a-rows').value);
    const matrixACols = parseInt(document.getElementById('matrix-a-cols').value);
    const matrixBRows = parseInt(document.getElementById('matrix-b-rows').value);
    const matrixBCols = parseInt(document.getElementById('matrix-b-cols').value);

    createMatrixGrid('matrix-a-grid', matrixARows, matrixACols);
    createMatrixGrid('matrix-b-grid', matrixBRows, matrixBCols);
    createMatrixGrid('result-grid', matrixARows, matrixBCols, true);
}

// Create a matrix grid
function createMatrixGrid(containerId, rows, cols, readonly = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, 60px)`;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = '0';
            input.readOnly = readonly;
            container.appendChild(input);
        }
    }
}

// Set up calculate button
function setupCalculateButton() {
    const calculateButton = document.getElementById('calculate-matrix');
    calculateButton.addEventListener('click', calculateResult);
}

// Calculate result based on current operation
function calculateResult() {
    const matrixA = getMatrixValues('matrix-a-grid');
    const matrixB = getMatrixValues('matrix-b-grid');
    let result;

    switch (currentOperation) {
        case 'add':
            result = addMatrices(matrixA, matrixB);
            break;
        case 'subtract':
            result = subtractMatrices(matrixA, matrixB);
            break;
        case 'multiply':
            result = multiplyMatrices(matrixA, matrixB);
            break;
        case 'transpose':
            result = transposeMatrix(matrixA);
            break;
        case 'determinant':
            result = calculateDeterminant(matrixA);
            break;
        case 'inverse':
            result = calculateInverse(matrixA);
            break;
        default:
            result = [];
    }

    displayResult(result);
}

// Get matrix values from grid
function getMatrixValues(containerId) {
    const container = document.getElementById(containerId);
    const inputs = container.querySelectorAll('input');
    const rows = parseInt(document.getElementById(containerId.replace('-grid', '-rows')).value);
    const cols = parseInt(document.getElementById(containerId.replace('-grid', '-cols')).value);
    const values = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(parseFloat(inputs[i * cols + j].value) || 0);
        }
        values.push(row);
    }
    return values;
}

// Display result in the result grid
function displayResult(result) {
    const resultGrid = document.getElementById('result-grid');
    const rows = parseInt(document.getElementById('matrix-a-rows').value);
    const cols = parseInt(document.getElementById('matrix-b-cols').value);
    
    resultGrid.innerHTML = '';
    resultGrid.style.gridTemplateColumns = `repeat(${cols}, 60px)`;

    // Handle special cases like determinant
    if (typeof result === 'number') {
        const input = document.createElement('input');
        input.type = 'number';
        input.value = result.toFixed(3);
        input.readOnly = true;
        resultGrid.appendChild(input);
        return;
    }

    // Handle matrix results
    result.forEach(row => {
        row.forEach(value => {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = value.toFixed(3);
            input.readOnly = true;
            resultGrid.appendChild(input);
        });
    });
}

// Matrix Operations
function addMatrices(a, b) {
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

function subtractMatrices(a, b) {
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
}

function multiplyMatrices(a, b) {
    const result = Array.from({ length: a.length }, () => Array(b[0].length).fill(0));
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b[0].length; j++) {
            for (let k = 0; k < a[0].length; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return result;
}

function transposeMatrix(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function calculateDeterminant(matrix) {
    if (matrix.length !== matrix[0].length) throw new Error('Matrix must be square');
    if (matrix.length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    let determinant = 0;
    for (let i = 0; i < matrix.length; i++) {
        determinant += ((i % 2 === 0 ? 1 : -1) * matrix[0][i] * calculateDeterminant(getSubMatrix(matrix, 0, i)));
    }
    return determinant;
}

function getSubMatrix(matrix, row, col) {
    return matrix.slice(0, row).concat(matrix.slice(row + 1)).map(r => r.slice(0, col).concat(r.slice(col + 1)));
}

function calculateInverse(matrix) {
    const determinant = calculateDeterminant(matrix);
    if (determinant === 0) throw new Error('Matrix is not invertible');
    const adjugate = matrix.map((row, i) => row.map((_, j) => {
        const subMatrix = getSubMatrix(matrix, i, j);
        const subDeterminant = calculateDeterminant(subMatrix);
        return ((i + j) % 2 === 0 ? 1 : -1) * subDeterminant;
    }));
    const transposeAdjugate = transposeMatrix(adjugate);
    return transposeAdjugate.map(row => row.map(value => value / determinant));
}
