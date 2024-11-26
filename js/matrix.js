// Matrix Calculator JavaScript

// Current operation
let currentOperation = 'add';

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    setupOperationButtons();
    setupSizeInputs();
    setupCalculateButton();
    
    // Initial matrix setup
    updateMatrixGrids();
});

// Set up operation buttons
function setupOperationButtons() {
    const operationButtons = document.querySelectorAll('.operation-btn');
    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            operationButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update current operation
            currentOperation = button.dataset.operation;
            
            // Update operation symbol
            updateOperationSymbol();
            
            // Show/hide matrix B based on operation
            const matrixB = document.querySelector('.matrix-b');
            const matrixBSize = document.querySelector('.matrix-b-size');
            if (['determinant', 'inverse', 'transpose'].includes(currentOperation)) {
                matrixB.style.display = 'none';
                matrixBSize.style.display = 'none';
            } else {
                matrixB.style.display = 'block';
                matrixBSize.style.display = 'block';
            }
        });
    });
}

// Update operation symbol between matrices
function updateOperationSymbol() {
    const symbol = document.querySelector('.operation-symbol');
    switch(currentOperation) {
        case 'add':
            symbol.textContent = '+';
            break;
        case 'subtract':
            symbol.textContent = '-';
            break;
        case 'multiply':
            symbol.textContent = '×';
            break;
        default:
            symbol.textContent = '';
    }
}

// Set up size input handlers
function setupSizeInputs() {
    const sizeInputs = document.querySelectorAll('.size-inputs input');
    sizeInputs.forEach(input => {
        input.addEventListener('change', updateMatrixGrids);
    });
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
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

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

// Get matrix values from grid
function getMatrixValues(containerId, rows, cols) {
    const matrix = [];
    const inputs = document.querySelectorAll(`#${containerId} input`);
    
    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < cols; j++) {
            matrix[i][j] = parseFloat(inputs[i * cols + j].value) || 0;
        }
    }
    
    return matrix;
}

// Set up calculate button
function setupCalculateButton() {
    document.getElementById('calculate-matrix').addEventListener('click', calculateResult);
}

// Calculate result based on current operation
function calculateResult() {
    const matrixARows = parseInt(document.getElementById('matrix-a-rows').value);
    const matrixACols = parseInt(document.getElementById('matrix-a-cols').value);
    const matrixBRows = parseInt(document.getElementById('matrix-b-rows').value);
    const matrixBCols = parseInt(document.getElementById('matrix-b-cols').value);

    const matrixA = getMatrixValues('matrix-a-grid', matrixARows, matrixACols);
    let result;

    switch(currentOperation) {
        case 'add':
            if (matrixARows !== matrixBRows || matrixACols !== matrixBCols) {
                alert('Matrices must be the same size for addition');
                return;
            }
            const matrixB = getMatrixValues('matrix-b-grid', matrixBRows, matrixBCols);
            result = addMatrices(matrixA, matrixB);
            break;
            
        case 'subtract':
            if (matrixARows !== matrixBRows || matrixACols !== matrixBCols) {
                alert('Matrices must be the same size for subtraction');
                return;
            }
            const matrixBSub = getMatrixValues('matrix-b-grid', matrixBRows, matrixBCols);
            result = subtractMatrices(matrixA, matrixBSub);
            break;
            
        case 'multiply':
            if (matrixACols !== matrixBRows) {
                alert('Number of columns in first matrix must equal number of rows in second matrix');
                return;
            }
            const matrixBMul = getMatrixValues('matrix-b-grid', matrixBRows, matrixBCols);
            result = multiplyMatrices(matrixA, matrixBMul);
            break;
            
        case 'determinant':
            if (matrixARows !== matrixACols) {
                alert('Matrix must be square to calculate determinant');
                return;
            }
            const det = calculateDeterminant(matrixA);
            document.getElementById('result-grid').innerHTML = `<span class="determinant-result">${det}</span>`;
            return;
            
        case 'inverse':
            if (matrixARows !== matrixACols) {
                alert('Matrix must be square to calculate inverse');
                return;
            }
            result = calculateInverse(matrixA);
            if (!result) {
                alert('Matrix is not invertible (determinant is 0)');
                return;
            }
            break;
            
        case 'transpose':
            result = transposeMatrix(matrixA);
            break;
    }

    displayResult(result);
}

// Matrix Operations
function addMatrices(a, b) {
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

function subtractMatrices(a, b) {
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
}

function multiplyMatrices(a, b) {
    return a.map((row, i) => 
        Array(b[0].length).fill(0).map((_, j) => 
            row.reduce((sum, val, k) => sum + val * b[k][j], 0)
        )
    );
}

function transposeMatrix(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function calculateDeterminant(matrix) {
    if (matrix.length === 1) return matrix[0][0];
    if (matrix.length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    let det = 0;
    for (let i = 0; i < matrix.length; i++) {
        det += Math.pow(-1, i) * matrix[0][i] * calculateDeterminant(getSubMatrix(matrix, 0, i));
    }
    return det;
}

function getSubMatrix(matrix, row, col) {
    return matrix
        .filter((_, index) => index !== row)
        .map(row => row.filter((_, index) => index !== col));
}

function calculateInverse(matrix) {
    const det = calculateDeterminant(matrix);
    if (det === 0) return null;

    const cofactorMatrix = matrix.map((row, i) =>
        row.map((_, j) => {
            const subMatrix = getSubMatrix(matrix, i, j);
            return Math.pow(-1, i + j) * calculateDeterminant(subMatrix);
        })
    );

    const adjugateMatrix = transposeMatrix(cofactorMatrix);
    return adjugateMatrix.map(row => row.map(val => val / det));
}

// Display result in the result grid
function displayResult(result) {
    const resultGrid = document.getElementById('result-grid');
    resultGrid.innerHTML = '';
    resultGrid.style.gridTemplateColumns = `repeat(${result[0].length}, 1fr)`;

    result.forEach(row => {
        row.forEach(val => {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = Math.round(val * 1000) / 1000; // Round to 3 decimal places
            input.readOnly = true;
            resultGrid.appendChild(input);
        });
    });
}
