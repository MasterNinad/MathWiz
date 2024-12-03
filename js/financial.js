// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Financial Calculator Setup
function setupFinancialCalculator() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const compoundInputs = document.querySelector('.compound-only');
    const roiInputs = document.querySelectorAll('.roi-only');
    const currencyInputs = document.querySelectorAll('.currency-only');
    const simpleCompoundInputs = document.querySelectorAll('.simple-compound');
    const principalInput = document.getElementById('principal');
    const initialInvestmentInput = document.getElementById('initial-investment');
    const finalValueInput = document.getElementById('final-value');
    const amountToConvertInput = document.getElementById('amount-to-convert');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const rateInput = document.getElementById('rate');
    const timeInput = document.getElementById('time');
    const timeUnitSelect = document.getElementById('time-unit');
    const frequencySelect = document.getElementById('frequency');
    const presetBtns = document.querySelectorAll('.preset-btn');

    // Set initial labels
    updateResultLabels('simple-compound');

    // Handle time unit changes
    timeUnitSelect.addEventListener('change', calculateResults);

    // Handle frequency changes
    frequencySelect.addEventListener('change', calculateResults);

    // Format and handle ROI inputs
    [initialInvestmentInput, finalValueInput].forEach(input => {
        if (input) {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/[^0-9]/g, '');
                if (value) {
                    const number = parseInt(value);
                    e.target.value = formatIndianNumber(number);
                } else {
                    e.target.value = '';
                }
                calculateResults();
            });
        }
    });

    // Handle principal input formatting
    principalInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value) {
            const number = parseInt(value);
            e.target.value = formatIndianNumber(number);
        } else {
            e.target.value = '';
        }
        calculateResults();
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
        calculateResults();
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
        calculateResults();
    });

    // Handle currency inputs
    [fromCurrencySelect, toCurrencySelect].forEach(select => {
        if (select) {
            select.addEventListener('change', () => {
                calculateCurrency();
            });
        }
    });

    if (amountToConvertInput) {
        amountToConvertInput.addEventListener('input', debounce(function(e) {
            let value = e.target.value.replace(/[^0-9.]/g, '');
            // Allow only one decimal point
            const decimalCount = (value.match(/\./g) || []).length;
            if (decimalCount > 1) {
                value = value.replace(/\./g, (match, index) => index === value.indexOf('.') ? match : '');
            }
            e.target.value = value;
            calculateCurrency();
        }, 300));
    }

    // Toggle between calculators
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const calculatorType = btn.dataset.type;
            
            // Show/hide appropriate inputs
            if (calculatorType === 'compound') {
                compoundInputs.style.display = 'block';
                roiInputs.forEach(el => el.style.display = 'none');
                currencyInputs.forEach(el => el.style.display = 'none');
                simpleCompoundInputs.forEach(el => el.style.display = 'block');
                updateResultLabels('simple-compound');
            } else if (calculatorType === 'roi') {
                compoundInputs.style.display = 'none';
                roiInputs.forEach(el => el.style.display = 'block');
                currencyInputs.forEach(el => el.style.display = 'none');
                simpleCompoundInputs.forEach(el => el.style.display = 'none');
                updateResultLabels('roi');
            } else if (calculatorType === 'currency') {
                compoundInputs.style.display = 'none';
                roiInputs.forEach(el => el.style.display = 'none');
                currencyInputs.forEach(el => el.style.display = 'block');
                simpleCompoundInputs.forEach(el => el.style.display = 'none');
            } else {
                compoundInputs.style.display = 'none';
                roiInputs.forEach(el => el.style.display = 'none');
                currencyInputs.forEach(el => el.style.display = 'none');
                simpleCompoundInputs.forEach(el => el.style.display = 'block');
                updateResultLabels('simple-compound');
            }
            
            calculateResults();
        });
    });

    // Preset amount buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseInt(btn.dataset.amount);
            principalInput.value = formatIndianNumber(amount);
            calculateResults();
        });
    });

    // Handle copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);
            
            try {
                await navigator.clipboard.writeText(input.value);
                
                // Visual feedback
                btn.classList.add('copied');
                const icon = btn.querySelector('i');
                icon.classList.remove('fa-copy');
                icon.classList.add('fa-check');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    btn.classList.remove('copied');
                    icon.classList.remove('fa-check');
                    icon.classList.add('fa-copy');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text:', err);
            }
        });
    });

    // Initial calculation
    calculateResults();
}

// Function to update result labels based on calculator type
function updateResultLabels(type) {
    const resultLabels = document.querySelectorAll('.result-label');
    resultLabels.forEach(label => {
        label.textContent = label.dataset[type];
    });
}

// Calculate Results based on calculator type
function calculateResults() {
    const calculatorType = document.querySelector('.toggle-btn.active').dataset.type;
    
    if (calculatorType === 'roi') {
        calculateROI();
    } else if (calculatorType === 'currency') {
        calculateCurrency();
    } else {
        calculateInterest();
    }
    // Update labels
    updateResultLabels(calculatorType);
}

// Calculate ROI
function calculateROI() {
    const initialInvestment = parseFloat(document.getElementById('initial-investment').value.replace(/,/g, '')) || 0;
    const finalValue = parseFloat(document.getElementById('final-value').value.replace(/,/g, '')) || 0;
    
    let roi = 0;
    let profit = 0;
    
    if (initialInvestment > 0) {
        profit = finalValue - initialInvestment;
        roi = (profit / initialInvestment) * 100;
    }

    // Format and display results
    document.getElementById('interest-result').value = formatCurrency(profit);
    document.getElementById('total-result').value = roi.toFixed(2) + '%';
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

// Calculate Currency Conversion
async function calculateCurrency() {
    const amount = parseFloat(document.getElementById('amount-to-convert').value) || 0;
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;

    if (!fromCurrency || !toCurrency) return;

    try {
        // Using the ExchangeRate-API for real-time rates
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();
        
        const rate = data.rates[toCurrency];
        const convertedAmount = amount * rate;
        
        // Format the converted amount based on currency
        const convertedFormatted = amount ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: toCurrency
        }).format(convertedAmount) : '-';
        
        // Format the exchange rate
        const rateFormatted = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
        
        // Display results
        document.getElementById('interest-result').value = convertedFormatted;
        document.getElementById('total-result').value = rateFormatted;
    } catch (error) {
        document.getElementById('interest-result').value = 'Error fetching rates';
        document.getElementById('total-result').value = 'Try again later';
    }
}
