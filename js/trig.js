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

// Draw unit circle with angle
function drawUnitCircle(angleInRadians) {
    const canvas = document.getElementById('unit-circle');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2.5;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set line styles
    ctx.lineWidth = 1;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();

    // Draw coordinate axes
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Draw unit circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
    ctx.stroke();

    // Calculate point on circle
    const x = radius * Math.cos(angleInRadians);
    const y = radius * Math.sin(angleInRadians);

    // Draw angle arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius / 4, 0, -angleInRadians, angleInRadians > 0);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    ctx.stroke();

    // Draw radius line to point
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + x, centerY - y);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw projection lines
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX + x, centerY - y);
    ctx.lineTo(centerX + x, centerY);
    ctx.moveTo(centerX + x, centerY - y);
    ctx.lineTo(centerX, centerY - y);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw point on circle
    ctx.beginPath();
    ctx.arc(centerX + x, centerY - y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    ctx.fill();

    // Update angle labels based on unit mode
    const angleUnitToggle = document.querySelector('#angle-unit');
    const isRadians = angleUnitToggle.checked;
    const labels = document.querySelectorAll('.circle-labels span');
    labels.forEach(label => {
        const angle = parseInt(label.className.replace('label-', ''));
        label.textContent = isRadians ? `${(angle * Math.PI / 180).toFixed(1)}π` : `${angle}°`;
    });
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

// Calculate trigonometric values
function calculateTrig() {
    const angleInput = document.querySelector('#angle');
    const angleUnitToggle = document.querySelector('#angle-unit');
    const angle = parseFloat(angleInput.value) || 0;
    const isRadians = angleUnitToggle.checked;
    
    // Convert angle to radians for calculation if needed
    const angleInRadians = isRadians ? angle : (angle * Math.PI / 180);
    
    try {
        // Draw unit circle
        drawUnitCircle(angleInRadians);

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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', setupTrigCalculator);
