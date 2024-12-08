document.addEventListener('DOMContentLoaded', function() {
    // Setup toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const calculatorInputs = document.querySelectorAll('.calculator-inputs');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all calculator inputs
            calculatorInputs.forEach(input => input.style.display = 'none');
            
            // Show the selected calculator inputs
            const calculatorType = this.getAttribute('data-type');
            document.querySelector(`.${calculatorType}-inputs`).style.display = 'block';
            
            // Clear results
            document.getElementById('physics-result').innerHTML = '';
        });
    });
});

// Vector Calculator Functions
function getVector(id) {
    return {
        x: parseFloat(document.getElementById(id + 'x').value) || 0,
        y: parseFloat(document.getElementById(id + 'y').value) || 0,
        z: parseFloat(document.getElementById(id + 'z').value) || 0
    };
}

function displayResult(result) {
    document.getElementById('physics-result').innerHTML = result;
}

function addVectors() {
    const v1 = getVector('v1');
    const v2 = getVector('v2');
    const result = {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
        z: v1.z + v2.z
    };
    displayResult(`Result: <${result.x.toFixed(2)}, ${result.y.toFixed(2)}, ${result.z.toFixed(2)}>`);
}

function subtractVectors() {
    const v1 = getVector('v1');
    const v2 = getVector('v2');
    const result = {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
        z: v1.z - v2.z
    };
    displayResult(`Result: <${result.x.toFixed(2)}, ${result.y.toFixed(2)}, ${result.z.toFixed(2)}>`);
}

function dotProduct() {
    const v1 = getVector('v1');
    const v2 = getVector('v2');
    const result = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    displayResult(`Dot Product: ${result.toFixed(2)}`);
}

function crossProduct() {
    const v1 = getVector('v1');
    const v2 = getVector('v2');
    const result = {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x
    };
    displayResult(`Cross Product: <${result.x.toFixed(2)}, ${result.y.toFixed(2)}, ${result.z.toFixed(2)}>`);
}

function magnitude(vectorId) {
    const v = getVector(vectorId);
    const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    displayResult(`Magnitude of ${vectorId.toUpperCase()}: ${mag.toFixed(2)}`);
}

// Linear Motion Calculator Functions
function calculateLinearMotion() {
    const v0 = parseFloat(document.getElementById('initial-velocity').value);
    const a = parseFloat(document.getElementById('acceleration').value);
    const t = parseFloat(document.getElementById('time').value);
    
    if (isNaN(v0) || isNaN(a) || isNaN(t)) {
        displayResult('Please enter valid numbers for all fields');
        return;
    }
    
    // Calculate final velocity: v = v0 + at
    const v = v0 + a * t;
    
    // Calculate displacement: s = v0t + (1/2)at²
    const s = v0 * t + 0.5 * a * t * t;
    
    const results = `
        <p>Final Velocity: ${v.toFixed(2)} m/s</p>
        <p>Displacement: ${s.toFixed(2)} m</p>
        <p>Average Velocity: ${((v0 + v) / 2).toFixed(2)} m/s</p>
    `;
    
    displayResult(results);
}

// Projectile Motion Calculator Functions
function calculateProjectileMotion() {
    const v0 = parseFloat(document.getElementById('initial-velocity-p').value);
    const angle = parseFloat(document.getElementById('angle').value);
    const h0 = parseFloat(document.getElementById('height').value);
    
    if (isNaN(v0) || isNaN(angle) || isNaN(h0)) {
        displayResult('Please enter valid numbers for all fields');
        return;
    }
    
    const g = 9.81; // acceleration due to gravity in m/s²
    const angleRad = angle * Math.PI / 180; // convert angle to radians
    
    // Initial velocities
    const v0x = v0 * Math.cos(angleRad);
    const v0y = v0 * Math.sin(angleRad);
    
    // Time of flight
    const timeOfFlight = (v0y + Math.sqrt(v0y * v0y + 2 * g * h0)) / g;
    
    // Maximum height
    const maxHeight = h0 + (v0y * v0y) / (2 * g);
    
    // Range
    const range = v0x * timeOfFlight;
    
    const results = `
        <p>Time of Flight: ${timeOfFlight.toFixed(2)} s</p>
        <p>Maximum Height: ${maxHeight.toFixed(2)} m</p>
        <p>Range: ${range.toFixed(2)} m</p>
        <p>Initial Horizontal Velocity: ${v0x.toFixed(2)} m/s</p>
        <p>Initial Vertical Velocity: ${v0y.toFixed(2)} m/s</p>
    `;
    
    displayResult(results);
}
