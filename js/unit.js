// Unit definitions and conversion factors
const unitTypes = {
    length: {
        name: 'Length',
        units: {
            km: { name: 'Kilometers', toBase: x => x * 1000 },
            m: { name: 'Meters', toBase: x => x },
            cm: { name: 'Centimeters', toBase: x => x * 0.01 },
            mm: { name: 'Millimeters', toBase: x => x * 0.001 },
            mi: { name: 'Miles', toBase: x => x * 1609.344 },
            yd: { name: 'Yards', toBase: x => x * 0.9144 },
            ft: { name: 'Feet', toBase: x => x * 0.3048 },
            in: { name: 'Inches', toBase: x => x * 0.0254 }
        },
        baseUnit: 'm',
        presetConversions: [
            { value: 1, from: 'km', to: 'mi', label: '1 km to mi' },
            { value: 1, from: 'm', to: 'ft', label: '1 m to ft' },
            { value: 100, from: 'cm', to: 'in', label: '100 cm to in' },
            { value: 5, from: 'km', to: 'm', label: '5 km to m' },
            { value: 30, from: 'cm', to: 'in', label: '30 cm to in' }
        ]
    },
    mass: {
        name: 'Mass',
        units: {
            kg: { name: 'Kilograms', toBase: x => x * 1000 },
            g: { name: 'Grams', toBase: x => x },
            mg: { name: 'Milligrams', toBase: x => x * 0.001 },
            lb: { name: 'Pounds', toBase: x => x * 453.59237 },
            oz: { name: 'Ounces', toBase: x => x * 28.349523125 }
        },
        baseUnit: 'g',
        presetConversions: [
            { value: 1, from: 'kg', to: 'lb', label: '1 kg to lb' },
            { value: 100, from: 'g', to: 'oz', label: '100 g to oz' },
            { value: 1, from: 'lb', to: 'kg', label: '1 lb to kg' },
            { value: 500, from: 'g', to: 'lb', label: '500 g to lb' },
            { value: 16, from: 'oz', to: 'lb', label: '16 oz to lb' }
        ]
    },
    time: {
        name: 'Time',
        units: {
            ms: { name: 'Milliseconds', toBase: x => x * 0.001 },
            s: { name: 'Seconds', toBase: x => x },
            min: { name: 'Minutes', toBase: x => x * 60 },
            h: { name: 'Hours', toBase: x => x * 3600 },
            d: { name: 'Days', toBase: x => x * 86400 },
            wk: { name: 'Weeks', toBase: x => x * 604800 },
            mo: { name: 'Months', toBase: x => x * 2629746 },
            yr: { name: 'Years', toBase: x => x * 31556952 }
        },
        baseUnit: 's',
        presetConversions: [
            { value: 1, from: 'h', to: 'min', label: '1 h to min' },
            { value: 1, from: 'd', to: 'h', label: '1 d to h' },
            { value: 7, from: 'd', to: 'wk', label: '7 d to wk' },
            { value: 60, from: 's', to: 'min', label: '60 s to min' },
            { value: 30, from: 'd', to: 'mo', label: '30 d to mo' }
        ]
    },
    electricity: {
        name: 'Electricity',
        subTypes: {
            current: {
                name: 'Current',
                units: {
                    kA: { name: 'Kiloamperes', toBase: x => x * 1000 },
                    A: { name: 'Amperes', toBase: x => x },
                    mA: { name: 'Milliamperes', toBase: x => x * 0.001 },
                    µA: { name: 'Microamperes', toBase: x => x * 0.000001 }
                },
                baseUnit: 'A',
                presetConversions: [
                    { value: 1, from: 'A', to: 'mA', label: '1 A to mA' },
                    { value: 1000, from: 'mA', to: 'A', label: '1000 mA to A' },
                    { value: 0.1, from: 'A', to: 'mA', label: '100 mA' }
                ]
            },
            voltage: {
                name: 'Voltage',
                units: {
                    kV: { name: 'Kilovolts', toBase: x => x * 1000 },
                    V: { name: 'Volts', toBase: x => x },
                    mV: { name: 'Millivolts', toBase: x => x * 0.001 },
                    µV: { name: 'Microvolts', toBase: x => x * 0.000001 }
                },
                baseUnit: 'V',
                presetConversions: [
                    { value: 230, from: 'V', to: 'kV', label: '230 V to kV' },
                    { value: 5, from: 'V', to: 'mV', label: '5 V to mV' },
                    { value: 12, from: 'V', to: 'mV', label: '12 V to mV' }
                ]
            },
            power: {
                name: 'Power',
                units: {
                    MW: { name: 'Megawatts', toBase: x => x * 1000000 },
                    kW: { name: 'Kilowatts', toBase: x => x * 1000 },
                    W: { name: 'Watts', toBase: x => x },
                    mW: { name: 'Milliwatts', toBase: x => x * 0.001 }
                },
                baseUnit: 'W',
                presetConversions: [
                    { value: 1000, from: 'W', to: 'kW', label: '1000 W to kW' },
                    { value: 1, from: 'kW', to: 'W', label: '1 kW to W' },
                    { value: 100, from: 'W', to: 'mW', label: '100 W to mW' }
                ]
            },
            resistance: {
                name: 'Resistance',
                units: {
                    MΩ: { name: 'Megaohms', toBase: x => x * 1000000 },
                    kΩ: { name: 'Kiloohms', toBase: x => x * 1000 },
                    Ω: { name: 'Ohms', toBase: x => x },
                    mΩ: { name: 'Milliohms', toBase: x => x * 0.001 }
                },
                baseUnit: 'Ω',
                presetConversions: [
                    { value: 1000, from: 'Ω', to: 'kΩ', label: '1000 Ω to kΩ' },
                    { value: 1, from: 'MΩ', to: 'kΩ', label: '1 MΩ to kΩ' },
                    { value: 470, from: 'Ω', to: 'kΩ', label: '470 Ω to kΩ' }
                ]
            }
        }
    },
    temperature: {
        name: 'Temperature',
        units: {
            C: { name: 'Celsius', toBase: x => x },
            F: { name: 'Fahrenheit', toBase: x => (x - 32) * 5/9 },
            K: { name: 'Kelvin', toBase: x => x - 273.15 }
        },
        baseUnit: 'C',
        presetConversions: [
            { value: 0, from: 'C', to: 'F', label: '0°C to °F' },
            { value: 100, from: 'C', to: 'F', label: '100°C to °F' },
            { value: 32, from: 'F', to: 'C', label: '32°F to °C' },
            { value: 0, from: 'C', to: 'K', label: '0°C to K' },
            { value: 273.15, from: 'K', to: 'C', label: '273.15K to °C' }
        ]
    }
};

// Current unit type
let currentUnitType = 'electricity';
let currentSubType = 'current';

// Setup Unit Converter
function setupUnitConverter() {
    const fromValue = document.getElementById('from-value');
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    const unitTypeButtons = document.querySelectorAll('.unit-type-btn');
    const subTypeButtons = document.querySelectorAll('.sub-type-btn');
    const swapBtn = document.getElementById('swap-btn');
    const presetList = document.getElementById('common-conversions-list');

    // Set initial active unit type
    document.querySelector('[data-type="electricity"]').classList.add('active');

    // Add event listeners
    fromValue.addEventListener('input', () => convert());
    fromUnit.addEventListener('change', () => convert());
    toUnit.addEventListener('change', () => convert());

    unitTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            unitTypeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentUnitType = button.dataset.type;
            if (currentUnitType === 'electricity') {
                document.querySelector('.sub-type-container').style.display = 'block';
            } else {
                document.querySelector('.sub-type-container').style.display = 'none';
            }
            updateUnitSelects();
            updateCommonConversions();
            convert();
        });
    });

    subTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            subTypeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentSubType = button.dataset.subtype;
            updateUnitSelects();
            updateCommonConversions();
            convert();
        });
    });

    swapBtn.addEventListener('click', () => {
        const tempUnit = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = tempUnit;
        convert();
    });

    // Initial setup
    updateUnitSelects();
    updateCommonConversions();
}

// Update unit select options
function updateUnitSelects() {
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    let units;
    if (currentUnitType === 'electricity') {
        units = unitTypes[currentUnitType].subTypes[currentSubType].units;
    } else {
        units = unitTypes[currentUnitType].units;
    }

    // Clear existing options
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';

    // Add new options
    Object.entries(units).forEach(([code, unit]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${unit.name} (${code})`;
        fromUnit.appendChild(option.cloneNode(true));
        toUnit.appendChild(option);
    });

    // Set default selections
    if (currentUnitType === 'temperature') {
        fromUnit.value = 'C';
        toUnit.value = 'F';
    } else {
        const unitCodes = Object.keys(units);
        fromUnit.value = unitCodes[0];
        toUnit.value = unitCodes[1];
    }
}

// Update common conversions display
function updateCommonConversions() {
    const container = document.getElementById('common-conversions-list');
    let currentType;
    if (currentUnitType === 'electricity') {
        currentType = unitTypes[currentUnitType].subTypes[currentSubType];
    } else {
        currentType = unitTypes[currentUnitType];
    }
    
    container.innerHTML = '';
    
    currentType.presetConversions.forEach(preset => {
        const button = document.createElement('button');
        button.className = 'common-conversion-btn';
        button.textContent = preset.label;
        button.addEventListener('click', () => {
            document.getElementById('from-value').value = preset.value;
            document.getElementById('from-unit').value = preset.from;
            document.getElementById('to-unit').value = preset.to;
            convert();
        });
        container.appendChild(button);
    });
}

// Perform conversion
function convert(value = document.getElementById('from-value').value, 
                fromUnitCode = document.getElementById('from-unit').value, 
                toUnitCode = document.getElementById('to-unit').value) {
    
    if (!value || isNaN(value)) {
        document.getElementById('to-value').value = '';
        return '';
    }

    let unitType;
    if (currentUnitType === 'electricity') {
        unitType = unitTypes[currentUnitType].subTypes[currentSubType];
    } else {
        unitType = unitTypes[currentUnitType];
    }
    const fromUnit = unitType.units[fromUnitCode];
    const toUnit = unitType.units[toUnitCode];
    const baseUnit = unitType.baseUnit;

    // Convert to base unit
    let baseValue;
    if (currentUnitType === 'temperature') {
        baseValue = fromUnit.toBase(parseFloat(value));
    } else {
        baseValue = fromUnit.toBase(parseFloat(value));
    }

    // Convert from base unit to target unit
    let result;
    if (currentUnitType === 'temperature') {
        result = toUnit.fromBase(baseValue);
    } else {
        result = baseValue / unitType.units[toUnitCode].toBase(1);
    }

    // Format result
    result = formatResult(result);
    
    // Update output if this is not a common conversion
    if (document.getElementById('to-value')) {
        document.getElementById('to-value').value = result;
    }
    
    return result;
}

// Format result
function formatResult(result) {
    return result.toFixed(2);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', setupUnitConverter);
