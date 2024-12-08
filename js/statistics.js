// Statistics Calculator Setup
let numbers = [];

function setupStatisticsCalculator() {
    const dataInput = document.querySelector('#data');
    dataInput.addEventListener('keydown', handleDataInput);
    updateNumbersList();
    initializeResults();
}

function handleDataInput(event) {
    if (event.key === ',' || event.key === 'Enter') {
        event.preventDefault();
        addNumber(event);
    }
}

function addNumber(event) {
    const input = document.getElementById('data');
    const number = parseFloat(input.value);
    
    if (!isNaN(number)) {
        numbers.push(number);
        updateNumbersList();
        calculateStatistics();
        input.value = '';
    }
}

function clearNumbers() {
    numbers = [];
    updateNumbersList();
    calculateStatistics();
}

function clearLastNumber() {
    if (numbers.length > 0) {
        numbers.pop();
        updateNumbersList();
        calculateStatistics();
    }
}

function sortNumbers(direction) {
    if (numbers.length > 0) {
        numbers.sort((a, b) => direction === 'asc' ? a - b : b - a);
        updateNumbersList();
    }
}

function updateNumbersList() {
    const numbersList = document.getElementById('numbers-list');
    if (numbers.length === 0) {
        numbersList.innerHTML = '<em>No numbers entered yet</em>';
    } else {
        numbersList.innerHTML = numbers.join(', ');
    }
}

function initializeResults() {
    const results = document.querySelector('.stats-results');
    results.innerHTML = `
        <div class="result-group">
            <h3>Central Tendency</h3>
            <div class="result-box">
                <label>Mean</label>
                <input type="text" id="mean-result" readonly value="---">
            </div>
            <div class="result-box">
                <label>Median</label>
                <input type="text" id="median-result" readonly value="---">
            </div>
            <div class="result-box">
                <label>Mode</label>
                <input type="text" id="mode-result" readonly value="---">
            </div>
        </div>
        <div class="result-group">
            <h3>Data Summary</h3>
            <div class="result-box">
                <label>Sum</label>
                <input type="text" id="sum-result" readonly value="---">
            </div>
            <div class="result-box">
                <label>Count</label>
                <input type="text" id="count-result" readonly value="0">
            </div>
            <div class="result-box">
                <label>Range</label>
                <input type="text" id="range-result" readonly value="---">
            </div>
        </div>
        <div class="result-group">
            <h3>Variance and Standard Deviation</h3>
            <div class="result-box">
                <label>Variance</label>
                <input type="text" id="variance-result" readonly value="---">
            </div>
            <div class="result-box">
                <label>Standard Deviation</label>
                <input type="text" id="stddev-result" readonly value="---">
            </div>
        </div>
    `;
}

function calculateStatistics() {
    const count = numbers.length;
    
    // Initialize all results with placeholder
    const results = {
        'mean-result': '---',
        'median-result': '---',
        'mode-result': '---',
        'count-result': '---',
        'sum-result': '---',
        'range-result': '---',
        'variance-result': '---',
        'stddev-result': '---'
    };
    
    if (count > 0) {
        // Calculate sum first as it's needed for mean
        const sum = numbers.reduce((a, b) => a + b, 0);
        results['sum-result'] = sum.toFixed(2);
        results['count-result'] = count;
        
        // Calculate mean
        const mean = sum / count;
        results['mean-result'] = mean.toFixed(2);
        
        // Calculate median
        const sortedNumbers = [...numbers].sort((a, b) => a - b);
        const mid = Math.floor(count / 2);
        const median = count % 2 === 0 ? (sortedNumbers[mid - 1] + sortedNumbers[mid]) / 2 : sortedNumbers[mid];
        results['median-result'] = median.toFixed(2);
        
        // Calculate mode
        const frequency = {};
        let maxFreq = 0;
        let mode = [];
        numbers.forEach(num => {
            frequency[num] = (frequency[num] || 0) + 1;
            if (frequency[num] > maxFreq) {
                maxFreq = frequency[num];
                mode = [num];
            } else if (frequency[num] === maxFreq) {
                mode.push(num);
            }
        });
        results['mode-result'] = maxFreq === 1 ? 'No mode' : mode.join(', ');
        
        // Calculate range
        const range = Math.max(...numbers) - Math.min(...numbers);
        results['range-result'] = range.toFixed(2);

        // Calculate variance and standard deviation
        const squaredDiffs = numbers.map(x => Math.pow(x - mean, 2));
        const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (count - 1);
        results['variance-result'] = variance.toFixed(2);
        
        const stdDev = Math.sqrt(variance);
        results['stddev-result'] = stdDev.toFixed(2);
    }
    
    // Update all result fields
    Object.keys(results).forEach(id => {
        document.getElementById(id).value = results[id];
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', setupStatisticsCalculator);
