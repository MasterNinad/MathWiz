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
        value = value.replace(/[^0-9.]/g, '');
        // Allow only one decimal point
        const decimalCount = (value.match(/\./g) || []).length;
        if (decimalCount > 1) {
            value = value.replace(/\./g, (match, index) => index === value.indexOf('.') ? match : '');
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

// Format number with Indian number system (e.g., 1,00,000)
function formatIndianNumber(number) {
    return new Intl.NumberFormat('en-IN').format(number);
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
