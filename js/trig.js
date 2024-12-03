// Trigonometric Calculator Setup
function setupTrigCalculator() {
    const angleInput = document.querySelector('#angle');
    const angleUnitToggle = document.querySelector('#angle-unit');
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    // Add event listeners
    angleInput.addEventListener('input', calculateTrig);
    angleUnitToggle.addEventListener('change', function() {
        const unitLabel = document.querySelector('.unit-label');
        unitLabel.textContent = this.checked ? 'RAD' : 'DEG';
        calculateTrig();
    });
    
    // Add click handlers to preset buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            angleInput.value = btn.dataset.angle;
            calculateTrig();
        });
    });

    // Add keyboard input handler
    angleInput.addEventListener('keydown', handleTrigKeyboard);

    // Initial calculation
    calculateTrig();
}

// Handle keyboard input for trigonometric calculator
function handleTrigKeyboard(event) {
    const angleInput = event.target;
    const key = event.key;
    
    // Allow numbers
    if (key >= '0' && key <= '9') {
        return true;
    }
    
    // Allow one decimal point
    if (key === '.') {
        if (angleInput.value.includes('.')) {
            event.preventDefault();
        }
        return true;
    }
    
    // Allow navigation keys
    if (key === 'Backspace' || key === 'Delete' || 
        key === 'ArrowLeft' || key === 'ArrowRight' ||
        key === 'Tab') {
        return true;
    }
    
    // Allow negative numbers only at start
    if (key === '-' && angleInput.selectionStart === 0) {
        return true;
    }
    
    // Prevent all other keys
    event.preventDefault();
    return false;
}

// Calculate trigonometric values
function calculateTrig() {
    const angleInput = document.querySelector('#angle');
    const angleUnitToggle = document.querySelector('#angle-unit');
    const angle = parseFloat(angleInput.value) || 0;
    const isRadians = angleUnitToggle.checked;
    
    // Convert angle to radians for calculation if needed
    const angleInRadians = isRadians ? angle : (angle * Math.PI / 180);
    
    try {
        // Calculate primary trig values
        const sin = Math.sin(angleInRadians);
        const cos = Math.cos(angleInRadians);
        const tan = Math.tan(angleInRadians);
        
        // Calculate reciprocal trig values
        const cot = 1 / tan;
        const sec = 1 / cos;
        const cosec = 1 / sin;

        // Calculate inverse trig values (in radians)
        const arcsin = Math.asin(sin);
        const arccos = Math.acos(cos);
        const arctan = Math.atan(tan);
        
        // Update displays
        updateTrigDisplay('sin-result', sin);
        updateTrigDisplay('cos-result', cos);
        updateTrigDisplay('tan-result', tan);
        updateTrigDisplay('cot-result', cot);
        updateTrigDisplay('sec-result', sec);
        updateTrigDisplay('cosec-result', cosec);
        
        // Update inverse trig displays (convert to degrees if needed)
        const arcValue = isRadians ? 1 : 180 / Math.PI;
        updateTrigDisplay('arcsin-result', arcsin * arcValue);
        updateTrigDisplay('arccos-result', arccos * arcValue);
        updateTrigDisplay('arctan-result', arctan * arcValue);
    } catch (error) {
        console.error('Calculation error:', error);
        // Handle division by zero or other errors
        const errorInputs = ['sin-result', 'cos-result', 'tan-result', 
                           'cot-result', 'sec-result', 'cosec-result',
                           'arcsin-result', 'arccos-result', 'arctan-result'];
        errorInputs.forEach(id => {
            document.getElementById(id).value = 'undefined';
        });
    }
}

// Update trigonometric display
function updateTrigDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (!isFinite(value) || Math.abs(value) > 1e15) {
        element.value = 'undefined';
        return;
    }

    if (Math.abs(value) < 1e-10) {
        element.value = '0';
        return;
    }

    // Format the value with appropriate precision
    element.value = formatResult(value);
}
