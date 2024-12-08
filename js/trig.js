// Trigonometric Calculator Setup
function setupTrigCalculator() {
    // Angle Measurement Calculator
    const angleInput = document.querySelector('#angle');
    const angleUnitToggle = document.querySelector('#angle-unit');
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    // Ratio inputs
    const ratioInputs = [
        document.querySelector('#sin-result'),
        document.querySelector('#cos-result'),
        document.querySelector('#tan-result'),
        document.querySelector('#cot-result'),
        document.querySelector('#sec-result'),
        document.querySelector('#cosec-result'),
        document.querySelector('#arcsin-result'),
        document.querySelector('#arccos-result'),
        document.querySelector('#arctan-result')
    ];
    
    // Add event listeners for angle input
    angleInput.addEventListener('input', () => calculateFromAngle());
    angleUnitToggle.addEventListener('change', function() {
        const unitLabel = angleUnitToggle.closest('.unit-toggle').querySelector('.unit-label');
        unitLabel.textContent = this.checked ? 'RAD' : 'DEG';
        calculateFromAngle();
    });
    
    // Add event listeners for ratio inputs
    ratioInputs.forEach(input => {
        input.addEventListener('input', (event) => {
            const ratio = parseFloat(event.target.value);
            if (!isNaN(ratio)) {
                calculateFromRatio(event.target.id, ratio);
            }
        });
    });
    
    // Add click handlers to preset buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            angleInput.value = btn.dataset.angle;
            calculateFromAngle();
        });
    });

    // Add keyboard input handlers
    angleInput.addEventListener('keydown', handleTrigKeyboard);
    ratioInputs.forEach(input => {
        input.addEventListener('keydown', handleTrigKeyboard);
    });

    // Initial calculation
    calculateFromAngle();
}

// Handle keyboard input for trigonometric calculator
function handleTrigKeyboard(event) {
    const input = event.target;
    const key = event.key;
    
    // Allow numbers
    if (key >= '0' && key <= '9') {
        return true;
    }
    
    // Allow one decimal point
    if (key === '.') {
        if (input.value.includes('.')) {
            event.preventDefault();
        }
        return true;
    }
    
    // Allow negative numbers
    if (key === '-' && input.selectionStart === 0) {
        return true;
    }
    
    // Allow navigation keys
    if (key === 'Backspace' || key === 'Delete' || 
        key === 'ArrowLeft' || key === 'ArrowRight' ||
        key === 'Tab') {
        return true;
    }
    
    // Prevent all other input
    event.preventDefault();
    return false;
}

// Calculate trigonometric values from angle
function calculateFromAngle() {
    const angleInput = document.querySelector('#angle');
    const angleUnitToggle = document.querySelector('#angle-unit');
    let angle = parseFloat(angleInput.value) || 0;
    
    // Convert to radians if in degrees
    const angleInRadians = angleUnitToggle.checked ? angle : (angle * Math.PI / 180);
    
    // Normalize angle to [0, 2π)
    const normalizedAngle = ((angleInRadians % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    
    // Calculate basic ratios with special case handling
    let sin = Math.sin(normalizedAngle);
    let cos = Math.cos(normalizedAngle);
    let tan, cot, sec, cosec;
    
    // Handle special cases for common angles
    const epsilon = 1e-10; // Precision threshold
    
    // Check if angle is close to 90° or 270°
    if (Math.abs(Math.cos(normalizedAngle)) < epsilon) {
        cos = 0;
        sin = Math.abs(normalizedAngle - Math.PI/2) < epsilon ? 1 : -1;
        tan = sin * Infinity;
        cot = 0;
        sec = sin * Infinity;
        cosec = sin;
    }
    // Check if angle is close to 0°, 180°, or 360°
    else if (Math.abs(Math.sin(normalizedAngle)) < epsilon) {
        sin = 0;
        cos = Math.abs(normalizedAngle) < epsilon || Math.abs(normalizedAngle - 2 * Math.PI) < epsilon ? 1 : -1;
        tan = 0;
        cot = cos * Infinity;
        sec = cos;
        cosec = cos * Infinity;
    }
    else {
        tan = sin / cos;
        cot = cos / sin;
        sec = 1 / cos;
        cosec = 1 / sin;
    }
    
    // Calculate arc values (in radians)
    let arcsin = Math.asin(sin);
    let arccos = Math.acos(cos);
    let arctan = Math.atan2(sin, cos);
    
    // Convert arc values to degrees if needed
    if (!angleUnitToggle.checked) {
        arcsin = arcsin * 180 / Math.PI;
        arccos = arccos * 180 / Math.PI;
        arctan = arctan * 180 / Math.PI;
    }
    
    // Update display without triggering input events
    updateTrigDisplay('sin-result', sin, true);
    updateTrigDisplay('cos-result', cos, true);
    updateTrigDisplay('tan-result', tan, true);
    updateTrigDisplay('cot-result', cot, true);
    updateTrigDisplay('sec-result', sec, true);
    updateTrigDisplay('cosec-result', cosec, true);
    updateTrigDisplay('arcsin-result', arcsin, true);
    updateTrigDisplay('arccos-result', arccos, true);
    updateTrigDisplay('arctan-result', arctan, true);
    
    // Update unit circle
    drawUnitCircle(normalizedAngle);
}

// Calculate trigonometric values from a given ratio
function calculateFromRatio(ratioId, value) {
    if (!isFinite(value)) {
        return;
    }

    const angleUnitToggle = document.querySelector('#angle-unit');
    let angle;
    
    try {
        // Calculate angle based on the input ratio
        switch (ratioId) {
            case 'sin-result':
                if (Math.abs(value) > 1) return;
                if (Math.abs(value - 1) < 1e-10) angle = Math.PI/2;
                else if (Math.abs(value + 1) < 1e-10) angle = -Math.PI/2;
                else angle = Math.asin(value);
                break;
            case 'cos-result':
                if (Math.abs(value) > 1) return;
                if (Math.abs(value - 1) < 1e-10) angle = 0;
                else if (Math.abs(value + 1) < 1e-10) angle = Math.PI;
                else angle = Math.acos(value);
                break;
            case 'tan-result':
                if (Math.abs(value) < 1e-10) angle = 0;
                else if (!isFinite(value)) angle = Math.PI/2;
                else angle = Math.atan(value);
                break;
            case 'cot-result':
                if (Math.abs(value) < 1e-10) angle = Math.PI/2;
                else if (!isFinite(value)) angle = 0;
                else angle = Math.atan(1/value);
                break;
            case 'sec-result':
                if (Math.abs(value) < 1) return;
                if (Math.abs(value - 1) < 1e-10) angle = 0;
                else if (Math.abs(value + 1) < 1e-10) angle = Math.PI;
                else if (!isFinite(value)) angle = Math.PI/2;
                else angle = Math.acos(1/value);
                break;
            case 'cosec-result':
                if (Math.abs(value) < 1) return;
                if (Math.abs(value - 1) < 1e-10) angle = Math.PI/2;
                else if (Math.abs(value + 1) < 1e-10) angle = -Math.PI/2;
                else if (!isFinite(value)) angle = 0;
                else angle = Math.asin(1/value);
                break;
            default:
                return;
        }
        
        // Convert to degrees if not in radians mode
        const angleValue = angleUnitToggle.checked ? angle : (angle * 180 / Math.PI);
        
        // Update angle input without triggering input event
        const angleInput = document.querySelector('#angle');
        angleInput.value = formatResult(angleValue);
        
        // Recalculate all values using calculateFromAngle to ensure consistency
        calculateFromAngle();
    } catch (error) {
        console.error('Error calculating from ratio:', error);
    }
}

// Update trigonometric display
function updateTrigDisplay(elementId, value, skipEvent = false) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Handle infinite values
    if (!isFinite(value)) {
        if (element.type === 'number') {
            // For number inputs, use a very large value instead of infinity
            const maxValue = 1e15;
            element.value = value > 0 ? maxValue : -maxValue;
        } else {
            // For text inputs, show infinity symbol
            element.value = value > 0 ? '∞' : '-∞';
        }
        return;
    }

    // Handle very small values
    if (Math.abs(value) < 1e-10) {
        element.value = '0';
        return;
    }

    // Special case for values very close to integers
    if (Math.abs(Math.round(value) - value) < 1e-10) {
        value = Math.round(value);
    }

    // Format the value with appropriate precision
    const oldValue = element.value;
    const newValue = formatResult(value);
    
    if (oldValue !== newValue) {
        element.value = newValue;
        if (!skipEvent) {
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
}

// Format result with appropriate precision
function formatResult(value) {
    // For values very close to 1 or -1
    if (Math.abs(Math.abs(value) - 1) < 1e-10) {
        return value < 0 ? '-1' : '1';
    }
    
    // For very large values
    if (Math.abs(value) > 1e15) {
        return value > 0 ? '1e15' : '-1e15';
    }
    
    return Number(value.toFixed(6)).toString();
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', setupTrigCalculator);
