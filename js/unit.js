// Unit definitions and conversion factors
const unitTypes = {
    length: {
        name: 'Length',
        subTypes: {
            distance: {
                name: 'Distance',
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
            area: {
                name: 'Area',
                units: {
                    km2: { name: 'Square Kilometers', toBase: x => x * 1000000 },
                    ha: { name: 'Hectares', toBase: x => x * 10000 },
                    m2: { name: 'Square Meters', toBase: x => x },
                    cm2: { name: 'Square Centimeters', toBase: x => x * 0.0001 },
                    mm2: { name: 'Square Millimeters', toBase: x => x * 0.000001 },
                    mi2: { name: 'Square Miles', toBase: x => x * 2589988.11 },
                    ac: { name: 'Acres', toBase: x => x * 4046.86 },
                    ft2: { name: 'Square Feet', toBase: x => x * 0.092903 },
                    in2: { name: 'Square Inches', toBase: x => x * 0.00064516 }
                },
                baseUnit: 'm2',
                presetConversions: [
                    { value: 1, from: 'km2', to: 'mi2', label: '1 km² to mi²' },
                    { value: 1, from: 'ha', to: 'ac', label: '1 ha to ac' },
                    { value: 100, from: 'm2', to: 'ft2', label: '100 m² to ft²' },
                    { value: 1, from: 'ac', to: 'ha', label: '1 ac to ha' },
                    { value: 1000, from: 'cm2', to: 'in2', label: '1000 cm² to in²' }
                ]
            },
            solidVolume: {
                name: 'Solid Volume',
                units: {
                    m3: { name: 'Cubic Meters', toBase: x => x },
                    km3: { name: 'Cubic Kilometers', toBase: x => x * 1000000000 },
                    cm3: { name: 'Cubic Centimeters', toBase: x => x * 0.000001 },
                    mm3: { name: 'Cubic Millimeters', toBase: x => x * 0.000000001 },
                    ft3: { name: 'Cubic Feet', toBase: x => x * 0.028317 },
                    in3: { name: 'Cubic Inches', toBase: x => x * 0.000016387 },
                    yd3: { name: 'Cubic Yards', toBase: x => x * 0.764555 }
                },
                baseUnit: 'm3',
                presetConversions: [
                    { value: 1, from: 'm3', to: 'ft3', label: '1 m³ to ft³' },
                    { value: 1, from: 'yd3', to: 'm3', label: '1 yd³ to m³' },
                    { value: 1000, from: 'cm3', to: 'in3', label: '1000 cm³ to in³' }
                ]
            },
            liquidVolume: {
                name: 'Liquid Volume',
                units: {
                    L: { name: 'Liters', toBase: x => x },
                    mL: { name: 'Milliliters', toBase: x => x * 0.001 },
                    gal: { name: 'Gallons (US)', toBase: x => x * 3.78541 },
                    qt: { name: 'Quarts (US)', toBase: x => x * 0.946353 },
                    pt: { name: 'Pints (US)', toBase: x => x * 0.473176 },
                    cup: { name: 'Cups (US)', toBase: x => x * 0.236588 },
                    floz: { name: 'Fluid Ounces (US)', toBase: x => x * 0.0295735 }
                },
                baseUnit: 'L',
                presetConversions: [
                    { value: 1, from: 'L', to: 'gal', label: '1 L to gal' },
                    { value: 1000, from: 'mL', to: 'floz', label: '1000 mL to fl oz' },
                    { value: 1, from: 'gal', to: 'L', label: '1 gal to L' },
                    { value: 4, from: 'qt', to: 'gal', label: '4 qt to gal' },
                    { value: 2, from: 'pt', to: 'qt', label: '2 pt to qt' }
                ]
            }
        }
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
        subTypes: {
            standard: {
                name: 'Standard Time',
                units: {
                    ms: { name: 'Milliseconds', toBase: x => x * 0.001 },
                    s: { name: 'Seconds', toBase: x => x },
                    min: { name: 'Minutes', toBase: x => x * 60 },
                    h: { name: 'Hours', toBase: x => x * 3600 },
                    d: { name: 'Days', toBase: x => x * 86400 },
                    wk: { name: 'Weeks', toBase: x => x * 604800 },
                    mo: { name: 'Months (avg)', toBase: x => x * 2629746 },
                    yr: { name: 'Years', toBase: x => x * 31556952 }
                },
                baseUnit: 's',
                presetConversions: [
                    { value: 1, from: 'h', to: 'min', label: '1 h to min' },
                    { value: 24, from: 'h', to: 'd', label: '24 h to d' },
                    { value: 7, from: 'd', to: 'wk', label: '7 d to wk' },
                    { value: 60, from: 's', to: 'min', label: '60 s to min' },
                    { value: 365, from: 'd', to: 'yr', label: '365 d to yr' }
                ]
            },
            speed: {
                name: 'Speed',
                units: {
                    mps: { name: 'Meters per second', toBase: x => x },
                    kph: { name: 'Kilometers per hour', toBase: x => x / 3.6 },
                    mph: { name: 'Miles per hour', toBase: x => x / 2.237 },
                    fps: { name: 'Feet per second', toBase: x => x * 0.3048 },
                    knot: { name: 'Knots', toBase: x => x * 0.514444 },
                    mach: { name: 'Mach', toBase: x => x * 340.29 }
                },
                baseUnit: 'mps',
                presetConversions: [
                    { value: 60, from: 'kph', to: 'mph', label: '60 kph to mph' },
                    { value: 1, from: 'mps', to: 'kph', label: '1 m/s to kph' },
                    { value: 100, from: 'fps', to: 'mph', label: '100 ft/s to mph' },
                    { value: 1, from: 'mach', to: 'kph', label: '1 mach to kph' },
                    { value: 50, from: 'knot', to: 'kph', label: '50 knots to kph' }
                ]
            },
            acceleration: {
                name: 'Acceleration',
                units: {
                    mps2: { name: 'Meters per second²', toBase: x => x },
                    g: { name: 'G-force', toBase: x => x * 9.80665 },
                    fts2: { name: 'Feet per second²', toBase: x => x * 0.3048 },
                    kph_s: { name: 'Kilometers per hour per second', toBase: x => x / 3.6 },
                    mph_s: { name: 'Miles per hour per second', toBase: x => x / 2.237 }
                },
                baseUnit: 'mps2',
                presetConversions: [
                    { value: 1, from: 'g', to: 'mps2', label: '1 g to m/s²' },
                    { value: 9.81, from: 'mps2', to: 'g', label: '9.81 m/s² to g' },
                    { value: 32.2, from: 'fts2', to: 'mps2', label: '32.2 ft/s² to m/s²' },
                    { value: 10, from: 'kph_s', to: 'mps2', label: '10 kph/s to m/s²' }
                ]
            },
            duration: {
                name: 'Duration',
                units: {
                    century: { name: 'Centuries', toBase: x => x * 3155695200 },
                    decade: { name: 'Decades', toBase: x => x * 315569520 },
                    year: { name: 'Years', toBase: x => x * 31556952 },
                    quarter: { name: 'Quarters', toBase: x => x * 7889238 },
                    month: { name: 'Months', toBase: x => x * 2629746 },
                    fortnight: { name: 'Fortnights', toBase: x => x * 1209600 },
                    week: { name: 'Weeks', toBase: x => x * 604800 },
                    day: { name: 'Days', toBase: x => x * 86400 }
                },
                baseUnit: 's',
                presetConversions: [
                    { value: 1, from: 'century', to: 'decade', label: '1 century to decades' },
                    { value: 1, from: 'year', to: 'month', label: '1 year to months' },
                    { value: 1, from: 'quarter', to: 'month', label: '1 quarter to months' },
                    { value: 2, from: 'fortnight', to: 'week', label: '2 fortnights to weeks' }
                ]
            },
            frequency: {
                name: 'Frequency',
                units: {
                    Hz: { name: 'Hertz', toBase: x => x },
                    kHz: { name: 'Kilohertz', toBase: x => x * 1000 },
                    MHz: { name: 'Megahertz', toBase: x => x * 1000000 },
                    GHz: { name: 'Gigahertz', toBase: x => x * 1000000000 }
                },
                baseUnit: 'Hz',
                presetConversions: [
                    { value: 1, from: 'MHz', to: 'Hz', label: '1 MHz to Hz' },
                    { value: 1000, from: 'Hz', to: 'kHz', label: '1000 Hz to kHz' },
                    { value: 1000, from: 'kHz', to: 'MHz', label: '1000 kHz to MHz' },
                    { value: 2.4, from: 'GHz', to: 'MHz', label: '2.4 GHz to MHz' }
                ]
            }
        }
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
            C: { 
                name: 'Celsius', 
                toBase: x => x,
                fromBase: x => x 
            },
            F: { 
                name: 'Fahrenheit', 
                toBase: x => (x - 32) * 5/9,
                fromBase: x => (x * 9/5) + 32 
            },
            K: { 
                name: 'Kelvin', 
                toBase: x => x - 273.15,
                fromBase: x => x + 273.15 
            }
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
let currentUnitType = 'length';
let currentSubType = 'distance';

// Setup Unit Converter
function setupUnitConverter() {
    const fromValue = document.getElementById('from-value');
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    const unitTypeButtons = document.querySelectorAll('.unit-type-btn');
    const swapBtn = document.getElementById('swap-btn');
    const presetList = document.getElementById('common-conversions-list');

    // Set initial active unit type and hide length subtypes
    document.querySelector('[data-type="length"]').classList.add('active');
    document.querySelector('.length-subtypes').style.display = 'block';
    document.querySelector('.electricity-subtypes').style.display = 'none';

    // Add event listeners
    fromValue.addEventListener('input', () => convert());
    fromUnit.addEventListener('change', () => convert());
    toUnit.addEventListener('change', () => convert());

    // Handle unit type selection
    unitTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            unitTypeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentUnitType = button.dataset.type;

            // Reset all subtype buttons
            document.querySelectorAll('.sub-type-btn').forEach(btn => btn.classList.remove('active'));

            if (currentUnitType === 'length') {
                document.querySelector('.sub-type-container').style.display = 'block';
                document.querySelector('.electricity-subtypes').style.display = 'none';
                document.querySelector('.time-subtypes').style.display = 'none';
                document.querySelector('.length-subtypes').style.display = 'block';
                currentSubType = 'distance';
                document.querySelector('.length-subtypes .sub-type-btn[data-subtype="distance"]').classList.add('active');
            } else if (currentUnitType === 'time') {
                document.querySelector('.sub-type-container').style.display = 'block';
                document.querySelector('.electricity-subtypes').style.display = 'none';
                document.querySelector('.length-subtypes').style.display = 'none';
                document.querySelector('.time-subtypes').style.display = 'block';
                currentSubType = 'standard';
                document.querySelector('.time-subtypes .sub-type-btn[data-subtype="standard"]').classList.add('active');
            } else if (currentUnitType === 'electricity') {
                document.querySelector('.sub-type-container').style.display = 'block';
                document.querySelector('.time-subtypes').style.display = 'none';
                document.querySelector('.length-subtypes').style.display = 'none';
                document.querySelector('.electricity-subtypes').style.display = 'block';
                currentSubType = 'current';
                document.querySelector('.electricity-subtypes .sub-type-btn[data-subtype="current"]').classList.add('active');
            } else {
                document.querySelector('.sub-type-container').style.display = 'none';
                document.querySelector('.electricity-subtypes').style.display = 'none';
                document.querySelector('.length-subtypes').style.display = 'none';
                document.querySelector('.time-subtypes').style.display = 'none';
            }
            updateUnitSelects();
            updateCommonConversions();
            convert();
        });
    });

    // Handle subtype selection for both electricity and length
    document.querySelectorAll('.sub-type-btn').forEach(button => {
        button.addEventListener('click', () => {
            const parentContainer = button.closest('.electricity-subtypes, .length-subtypes, .time-subtypes');
            if (parentContainer) {
                parentContainer.querySelectorAll('.sub-type-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentSubType = button.dataset.subtype;
                updateUnitSelects();
                updateCommonConversions();
                convert();
            }
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
    } else if (currentUnitType === 'length') {
        units = unitTypes[currentUnitType].subTypes[currentSubType].units;
    } else if (currentUnitType === 'time') {
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
    } else if (currentUnitType === 'length') {
        currentType = unitTypes[currentUnitType].subTypes[currentSubType];
    } else if (currentUnitType === 'time') {
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
    } else if (currentUnitType === 'length') {
        unitType = unitTypes[currentUnitType].subTypes[currentSubType];
    } else if (currentUnitType === 'time') {
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
