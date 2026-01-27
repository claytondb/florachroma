// FloraChroma - Flower Color Theme Assistant

// Flower database with colors
const flowers = [
    { name: 'Rose', emoji: '🌹', colors: ['#e91e63', '#f44336', '#ffffff', '#ffeb3b', '#ff9800'] },
    { name: 'Tulip', emoji: '🌷', colors: ['#e91e63', '#f44336', '#ffeb3b', '#9c27b0', '#ffffff'] },
    { name: 'Sunflower', emoji: '🌻', colors: ['#ffeb3b', '#ff9800'] },
    { name: 'Lavender', emoji: '💜', colors: ['#9c27b0', '#ce93d8', '#7b1fa2'] },
    { name: 'Daisy', emoji: '🌼', colors: ['#ffffff', '#ffeb3b'] },
    { name: 'Hydrangea', emoji: '💠', colors: ['#3f51b5', '#e91e63', '#9c27b0', '#ffffff'] },
    { name: 'Peony', emoji: '🌸', colors: ['#f8bbd9', '#e91e63', '#ffffff'] },
    { name: 'Lily', emoji: '🪷', colors: ['#ffffff', '#ff9800', '#e91e63', '#ffeb3b'] },
    { name: 'Orchid', emoji: '🪻', colors: ['#9c27b0', '#e91e63', '#ffffff'] },
    { name: 'Carnation', emoji: '🏵️', colors: ['#e91e63', '#f44336', '#ffffff', '#ff9800'] },
    { name: 'Chrysanthemum', emoji: '🌺', colors: ['#ffeb3b', '#ff9800', '#9c27b0', '#ffffff', '#f44336'] },
    { name: 'Iris', emoji: '💐', colors: ['#3f51b5', '#9c27b0', '#ffeb3b'] },
    { name: 'Ranunculus', emoji: '🌹', colors: ['#ff9800', '#e91e63', '#ffeb3b', '#f44336'] },
    { name: 'Anemone', emoji: '🌸', colors: ['#f44336', '#3f51b5', '#9c27b0', '#ffffff'] },
    { name: 'Dahlia', emoji: '🌺', colors: ['#ff9800', '#e91e63', '#9c27b0', '#f44336', '#ffeb3b'] },
    { name: 'Freesia', emoji: '🌷', colors: ['#ffeb3b', '#ffffff', '#e91e63', '#9c27b0'] },
    { name: 'Greenery', emoji: '🌿', colors: ['#4caf50', '#2e7d32', '#81c784'] },
    { name: 'Baby\'s Breath', emoji: '☁️', colors: ['#ffffff', '#f8bbd9'] },
    { name: 'Eucalyptus', emoji: '🍃', colors: ['#4caf50', '#78909c', '#607d8b'] },
];

// Color names
const colorNames = {
    '#e91e63': 'Pink',
    '#f44336': 'Red',
    '#ff9800': 'Orange',
    '#ffeb3b': 'Yellow',
    '#9c27b0': 'Purple',
    '#3f51b5': 'Blue',
    '#4caf50': 'Green',
    '#ffffff': 'White',
    '#f8bbd9': 'Blush',
    '#ce93d8': 'Lavender',
    '#000000': 'Black',
};

// Harmony descriptions
const harmonyDescriptions = {
    complementary: 'Complementary colors sit opposite each other on the color wheel. They create high contrast and vibrant arrangements that really pop.',
    analogous: 'Analogous colors sit next to each other on the color wheel. They create harmonious, cohesive arrangements with a natural flow.',
    triadic: 'Triadic colors are evenly spaced around the color wheel. They create balanced, vibrant arrangements with variety.',
    split: 'Split-complementary uses one base color and two colors adjacent to its complement. It offers contrast while being easier on the eyes.',
    monochromatic: 'Monochromatic schemes use different shades of one color. They create elegant, sophisticated arrangements with depth.'
};

// State
let baseColor = '#e91e63';
let currentHarmony = 'complementary';
let currentPalette = [];
let savedPalettes = [];

// DOM Elements
const colorPicker = document.getElementById('base-color');
const colorHex = document.getElementById('color-hex');
const colorName = document.getElementById('color-name');
const harmonyDescription = document.getElementById('harmony-description');
const colorPalette = document.getElementById('color-palette');
const flowerSuggestions = document.getElementById('flower-suggestions');
const flowerPreview = document.getElementById('flower-preview');
const savedPalettesEl = document.getElementById('saved-palettes');

// Initialize
function init() {
    loadSavedPalettes();
    
    // Color picker change
    colorPicker.addEventListener('input', (e) => {
        baseColor = e.target.value;
        updateColorDisplay();
        generateHarmony();
    });
    
    // Preset colors
    document.querySelectorAll('.preset-color').forEach(btn => {
        btn.addEventListener('click', () => {
            baseColor = btn.dataset.color;
            colorPicker.value = baseColor;
            updateColorDisplay();
            generateHarmony();
        });
    });
    
    // Harmony tabs
    document.querySelectorAll('.harmony-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.harmony-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentHarmony = tab.dataset.harmony;
            generateHarmony();
        });
    });
    
    // Controls
    document.getElementById('randomize-btn').addEventListener('click', randomizeArrangement);
    document.getElementById('save-btn').addEventListener('click', savePalette);
    
    // Initial generation
    updateColorDisplay();
    generateHarmony();
}

function updateColorDisplay() {
    colorHex.textContent = baseColor.toUpperCase();
    colorName.textContent = getColorName(baseColor);
}

function getColorName(hex) {
    // Check exact matches first
    if (colorNames[hex.toLowerCase()]) return colorNames[hex.toLowerCase()];
    
    // Find closest named color
    let closest = 'Custom';
    let minDist = Infinity;
    
    for (const [namedHex, name] of Object.entries(colorNames)) {
        const dist = colorDistance(hex, namedHex);
        if (dist < minDist) {
            minDist = dist;
            closest = name;
        }
    }
    
    return minDist < 100 ? closest : 'Custom';
}

function colorDistance(hex1, hex2) {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    return Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function hexToHsl(hex) {
    const rgb = hexToRgb(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return rgbToHex(r * 255, g * 255, b * 255);
}

function generateHarmony() {
    const hsl = hexToHsl(baseColor);
    let colors = [baseColor];
    
    switch (currentHarmony) {
        case 'complementary':
            colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
            // Add tints
            colors.push(hslToHex(hsl.h, hsl.s * 0.5, Math.min(95, hsl.l + 20)));
            colors.push(hslToHex((hsl.h + 180) % 360, hsl.s * 0.5, Math.min(95, hsl.l + 20)));
            break;
            
        case 'analogous':
            colors.push(hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l));
            colors.push(hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l));
            colors.push(hslToHex((hsl.h + 15) % 360, hsl.s * 0.7, Math.min(90, hsl.l + 15)));
            break;
            
        case 'triadic':
            colors.push(hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
            colors.push(hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l));
            colors.push(hslToHex(hsl.h, hsl.s * 0.5, Math.min(95, hsl.l + 25)));
            break;
            
        case 'split':
            colors.push(hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l));
            colors.push(hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l));
            colors.push(hslToHex(hsl.h, hsl.s * 0.6, Math.min(90, hsl.l + 20)));
            break;
            
        case 'monochromatic':
            colors.push(hslToHex(hsl.h, hsl.s, Math.max(20, hsl.l - 20)));
            colors.push(hslToHex(hsl.h, hsl.s * 0.7, Math.min(90, hsl.l + 20)));
            colors.push(hslToHex(hsl.h, hsl.s * 0.4, Math.min(95, hsl.l + 35)));
            break;
    }
    
    // Always add a green for greenery
    colors.push('#4caf50');
    
    currentPalette = colors;
    
    // Update displays
    harmonyDescription.textContent = harmonyDescriptions[currentHarmony];
    renderPalette(colors);
    suggestFlowers(colors);
    updateArrangement(colors);
}

function renderPalette(colors) {
    colorPalette.innerHTML = colors.map((color, i) => `
        <div class="palette-color" style="background:${color}" onclick="copyColor('${color}')">
            <span>${color.toUpperCase()}</span>
        </div>
    `).join('');
}

function copyColor(color) {
    navigator.clipboard.writeText(color);
    // Visual feedback
    const el = event.target.closest('.palette-color');
    const original = el.innerHTML;
    el.innerHTML = '<span>Copied!</span>';
    setTimeout(() => el.innerHTML = original, 1000);
}
window.copyColor = copyColor;

function suggestFlowers(paletteColors) {
    // Find flowers that match palette colors
    const suggestions = [];
    
    flowers.forEach(flower => {
        let matchScore = 0;
        let bestMatchColor = null;
        
        flower.colors.forEach(flowerColor => {
            paletteColors.forEach(paletteColor => {
                const dist = colorDistance(flowerColor, paletteColor);
                if (dist < 80) {
                    matchScore += (80 - dist);
                    if (!bestMatchColor || dist < colorDistance(bestMatchColor, paletteColor)) {
                        bestMatchColor = flowerColor;
                    }
                }
            });
        });
        
        if (matchScore > 0) {
            suggestions.push({
                ...flower,
                score: matchScore,
                matchColor: bestMatchColor || flower.colors[0]
            });
        }
    });
    
    // Sort by score and take top 6
    suggestions.sort((a, b) => b.score - a.score);
    const topSuggestions = suggestions.slice(0, 6);
    
    flowerSuggestions.innerHTML = topSuggestions.map(f => `
        <div class="flower-card">
            <div class="flower-emoji">${f.emoji}</div>
            <div class="flower-name">${f.name}</div>
            <div class="flower-color" style="background:${f.matchColor}"></div>
        </div>
    `).join('');
}

function updateArrangement(colors) {
    // Generate flower shapes
    const numFlowers = 12 + Math.floor(Math.random() * 6);
    let flowers = '';
    
    for (let i = 0; i < numFlowers; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 25 + Math.random() * 15;
        const delay = Math.random() * 2;
        flowers += `<div class="flower-shape" style="
            background: radial-gradient(circle, ${lightenColor(color, 30)}, ${color});
            width: ${size}px;
            height: ${size}px;
            animation-delay: ${delay}s;
        "></div>`;
    }
    
    flowerPreview.innerHTML = flowers;
}

function lightenColor(hex, percent) {
    const rgb = hexToRgb(hex);
    return rgbToHex(
        rgb.r + (255 - rgb.r) * percent / 100,
        rgb.g + (255 - rgb.g) * percent / 100,
        rgb.b + (255 - rgb.b) * percent / 100
    );
}

function randomizeArrangement() {
    updateArrangement(currentPalette);
}

function savePalette() {
    const name = prompt('Name this palette:', `${getColorName(baseColor)} ${currentHarmony}`);
    if (!name) return;
    
    savedPalettes.push({
        name,
        colors: [...currentPalette],
        timestamp: Date.now()
    });
    
    localStorage.setItem('florachroma-palettes', JSON.stringify(savedPalettes));
    renderSavedPalettes();
}

function loadSavedPalettes() {
    const saved = localStorage.getItem('florachroma-palettes');
    if (saved) {
        savedPalettes = JSON.parse(saved);
        renderSavedPalettes();
    }
}

function renderSavedPalettes() {
    if (savedPalettes.length === 0) {
        savedPalettesEl.innerHTML = '<p class="empty-state">No saved palettes yet</p>';
        return;
    }
    
    savedPalettesEl.innerHTML = savedPalettes.map((p, i) => `
        <div class="saved-palette">
            <div class="colors">
                ${p.colors.map(c => `<div class="mini-color" style="background:${c}"></div>`).join('')}
            </div>
            <span class="name">${p.name}</span>
            <button class="delete-btn" onclick="deletePalette(${i})">✕</button>
        </div>
    `).join('');
}

function deletePalette(index) {
    savedPalettes.splice(index, 1);
    localStorage.setItem('florachroma-palettes', JSON.stringify(savedPalettes));
    renderSavedPalettes();
}
window.deletePalette = deletePalette;

// Initialize
document.addEventListener('DOMContentLoaded', init);
