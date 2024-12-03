// Statistics Calculator Setup
function setupStatisticsCalculator() {
    const dataInput = document.getElementById('data-values');
    const calculateBtn = document.getElementById('calculate-stats');
    const sortAscBtn = document.getElementById('sort-asc');
    const sortDescBtn = document.getElementById('sort-desc');
    const clearBtn = document.getElementById('clear-data');

    // Add event listeners
    calculateBtn.addEventListener('click', calculateStatistics);
    sortAscBtn.addEventListener('click', () => sortData('asc'));
    sortDescBtn.addEventListener('click', () => sortData('desc'));
    clearBtn.addEventListener('click', clearData);

    // Add keyboard handler for Enter key
    dataInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            calculateStatistics();
        }
    });
}

// Parse input data into array of numbers
function parseData() {
    const dataInput = document.getElementById('data-values').value;
    return dataInput
        .split(/[,\s]+/) // Split by comma or whitespace
        .map(str => str.trim())
        .filter(str => str !== '')
        .map(Number)
        .filter(num => !isNaN(num));
}

// Calculate mean
function calculateMean(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    return sum / numbers.length;
}

// Calculate median
function calculateMedian(numbers) {
    if (numbers.length === 0) return 0;
    
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
        return sorted[middle];
    }
}

// Calculate mode
function calculateMode(numbers) {
    if (numbers.length === 0) return 'None';

    const frequency = {};
    let maxFreq = 0;
    let modes = [];

    // Count frequency of each number
    numbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFreq) {
            maxFreq = frequency[num];
        }
    });

    // Find all numbers with maximum frequency
    for (const num in frequency) {
        if (frequency[num] === maxFreq) {
            modes.push(Number(num));
        }
    }

    // Return appropriate result based on modes found
    if (modes.length === numbers.length) {
        return 'No mode';
    } else if (modes.length > 3) {
        return 'Multiple modes';
    } else {
        return modes.join(', ');
    }
}

// Calculate range
function calculateRange(numbers) {
    if (numbers.length === 0) return 0;
    const max = Math.max(...numbers);
    const min = Math.min(...numbers);
    return max - min;
}

// Calculate all statistics
function calculateStatistics() {
    const numbers = parseData();
    
    if (numbers.length === 0) {
        showError('Please enter valid numbers');
        return;
    }

    // Calculate and display results
    document.getElementById('mean-result').value = formatResult(calculateMean(numbers));
    document.getElementById('median-result').value = formatResult(calculateMedian(numbers));
    document.getElementById('mode-result').value = calculateMode(numbers);
    document.getElementById('count-result').value = numbers.length;
    document.getElementById('sum-result').value = formatResult(numbers.reduce((a, b) => a + b, 0));
    document.getElementById('range-result').value = formatResult(calculateRange(numbers));
}

// Sort data in ascending or descending order
function sortData(direction) {
    const numbers = parseData();
    if (numbers.length === 0) {
        showError('Please enter valid numbers');
        return;
    }

    const sorted = direction === 'asc' 
        ? numbers.sort((a, b) => a - b)
        : numbers.sort((a, b) => b - a);
    
    document.getElementById('data-values').value = sorted.join(', ');
    calculateStatistics();
}

// Clear all data and results
function clearData() {
    document.getElementById('data-values').value = '';
    const results = ['mean-result', 'median-result', 'mode-result', 
                    'count-result', 'sum-result', 'range-result'];
    results.forEach(id => {
        document.getElementById(id).value = '';
    });
}

// Show error message
function showError(message) {
    const results = ['mean-result', 'median-result', 'mode-result', 
                    'count-result', 'sum-result', 'range-result'];
    results.forEach(id => {
        document.getElementById(id).value = 'Error';
    });
    console.error(message);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', setupStatisticsCalculator);
