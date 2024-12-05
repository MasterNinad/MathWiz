// Global variable for the chart
let compoundChart = null;

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
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide appropriate inputs
            if (type === 'compound') {
                compoundInputs.style.display = 'block';
                roiInputs.forEach(el => el.style.display = 'none');
                currencyInputs.forEach(el => el.style.display = 'none');
                simpleCompoundInputs.forEach(el => el.style.display = 'block');
                document.querySelector('.visualization-section').classList.add('visible');
            } else {
                compoundInputs.style.display = 'none';
                roiInputs.forEach(el => el.style.display = type === 'roi' ? 'block' : 'none');
                currencyInputs.forEach(el => el.style.display = type === 'currency' ? 'block' : 'none');
                simpleCompoundInputs.forEach(el => el.style.display = type === 'simple' ? 'block' : 'none');
                document.querySelector('.visualization-section').classList.remove('visible');
            }
            
            // Calculate results after toggle
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
    const principal = parseFloat(document.getElementById('principal').value.replace(/,/g, '')) || 0;
    const rate = parseFloat(document.getElementById('rate').value) || 0;
    const time = parseFloat(document.getElementById('time').value) || 0;
    const timeUnit = document.getElementById('time-unit').value;
    const calculatorType = document.querySelector('.toggle-btn.active').dataset.type;
    
    let timeInYears = time;
    if (timeUnit === 'months') {
        timeInYears = time / 12;
    }

    let interest = 0;
    let total = 0;

    if (calculatorType === 'compound') {
        const frequency = parseInt(document.getElementById('frequency').value);
        const rateDecimal = rate / 100;
        total = principal * Math.pow(1 + (rateDecimal / frequency), frequency * timeInYears);
        interest = total - principal;
        
        // Format and display results
        document.getElementById('interest-result').value = formatCurrency(interest);
        document.getElementById('total-result').value = formatCurrency(total);
        
        // Show visualization section and update chart
        const visualizationSection = document.querySelector('.visualization-section');
        visualizationSection.classList.add('visible');
        createCompoundInterestChart(principal, rate, timeInYears, frequency);
    } else {
        // Simple Interest: I = P * r * t
        interest = principal * (rate / 100) * timeInYears;
        total = principal + interest;
        
        // Hide visualization section
        document.querySelector('.visualization-section').classList.remove('visible');
        
        // Format and display results
        document.getElementById('interest-result').value = formatCurrency(interest);
        document.getElementById('total-result').value = formatCurrency(total);
    }
}

function createCompoundInterestChart(principal, rate, time, frequency) {
    try {
        const ctx = document.getElementById('compound-interest-chart');
        if (!ctx) {
            console.error('Chart canvas not found');
            return;
        }

        // Destroy existing chart if it exists
        if (compoundChart instanceof Chart) {
            compoundChart.destroy();
            compoundChart = null;
        }

        // Calculate points at smaller intervals for smoother curve
        const totalPoints = Math.ceil(time * 12); // Monthly points for smooth curve
        const timePoints = Array.from({length: totalPoints + 1}, (_, i) => i / 12);
        
        const balanceData = timePoints.map(t => {
            // A = P(1 + r/n)^(nt)
            // where: A = Final amount, P = Principal, r = Interest rate (decimal)
            // n = Compounding frequency per year, t = Time in years
            return principal * Math.pow(1 + (rate / (100 * frequency)), frequency * t);
        });

        // Create year labels (show only yearly points)
        const labels = timePoints.map(t => {
            if (t % 1 === 0) return `Year ${t}`;
            return ''; // Empty label for non-year points
        }).filter(label => label !== '');

        const principalLine = timePoints.map(() => principal);

        // Create new chart
        compoundChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timePoints.map(t => t % 1 === 0 ? `Year ${t}` : ''),
                datasets: [
                    {
                        label: 'Balance with Compound Interest',
                        data: balanceData,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 0, // Hide points
                        pointHoverRadius: 6, // Show points on hover
                        pointHoverBackgroundColor: '#4CAF50',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2
                    },
                    {
                        label: 'Principal Amount',
                        data: principalLine,
                        borderColor: '#2196F3',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        fill: false,
                        tension: 0,
                        pointRadius: 0, // Hide points
                        pointHoverRadius: 6, // Show points on hover
                        pointHoverBackgroundColor: '#2196F3',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Compound Interest Growth Over Time',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ₹' + formatIndianNumber(Math.round(context.parsed.y));
                            },
                            title: function(context) {
                                const timePoint = timePoints[context[0].dataIndex];
                                const years = Math.floor(timePoint);
                                const months = Math.round((timePoint % 1) * 12);
                                if (months === 0) {
                                    return `Year ${years}`;
                                }
                                return `Year ${years}, Month ${months}`;
                            }
                        },
                        padding: 10,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#fff',
                        borderWidth: 1,
                        displayColors: true,
                        boxPadding: 3
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return '₹' + formatIndianNumber(value);
                            },
                            padding: 10
                        },
                        title: {
                            display: true,
                            text: 'Amount (₹)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            padding: 20
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Time Period',
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            padding: 20
                        },
                        ticks: {
                            callback: function(value, index) {
                                const timePoint = timePoints[index];
                                return timePoint % 1 === 0 ? `Year ${timePoint}` : '';
                            },
                            maxRotation: 0,
                            padding: 10
                        }
                    }
                }
            }
        });
        console.log('Chart created successfully with frequency:', frequency);
    } catch (error) {
        console.error('Error creating chart:', error);
    }
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
