// ==============================================
// Part 2: JavaScript Functions — Scope, Parameters & Return Values
// ==============================================

// Global variables
const BAKERY_NAME = "Jonte's Sweet Delights Bakery";
let activeTimers = []; // Track all active timers

/* Calculate how many cupcakess are needed for a party*/
function calculateCupcakes() {
    // Get values from inputs
    const guests = parseInt(document.getElementById('guestCount').value) || 0;
    const appetite = parseFloat(document.getElementById('guestAppetite').value);
    
    // Simple calculation
    const totalCupcakes = Math.ceil(guests * appetite);
    
    // Display result
    document.getElementById('cupcakeResult').innerHTML = 
        `You need <strong>${totalCupcakes} cupcakes</strong> for ${guests} guests.`;
}

/**
 * Calculate ingredients for different cake sizes and types
 * @param {string} size - Cake size (small, medium, large, xlarge)
 * @param {string} type - Cake type (vanilla, chocolate, redVelvet)
 * @returns {object} - Ingredients object with amounts
 */
function getCakeIngredients(size, type) {
    // Local scope - size multipliers
    const sizeMultipliers = {
        small: 0.7,
        medium: 1,
        large: 1.5,
        xlarge: 2
    };
    
    // Local scope - base ingredients for different cake types
    const baseRecipes = {
        vanilla: {
            flour: 2,
            sugar: 1.5,
            butter: 0.5,
            eggs: 2,
            milk: 1,
            vanilla: 2
        },
        chocolate: {
            flour: 1.75,
            sugar: 1.5,
            cocoa: 0.75,
            butter: 0.5,
            eggs: 2,
            milk: 1
        },
        redVelvet: {
            flour: 2,
            sugar: 1.5,
            cocoa: 0.25,
            butter: 0.5,
            eggs: 2,
            buttermilk: 1,
            vinegar: 1,
            foodColor: 1
        }
    };
    
    const multiplier = sizeMultipliers[size] || 1;
    const baseRecipe = baseRecipes[type] || baseRecipes.vanilla;
    
    // Calculate scaled ingredients
    const ingredients = {};
    for (const [ingredient, amount] of Object.entries(baseRecipe)) {
        ingredients[ingredient] = (amount * multiplier).toFixed(2);
    }
    
    return ingredients;
}

/**
 * Format ingredients for display
 * @param {object} ingredients - Ingredients object
 * @returns {string} - Formatted HTML string
 */
function formatIngredients(ingredients) {
    let html = '<div class="ingredients-list">';
    for (const [ingredient, amount] of Object.entries(ingredients)) {
        const unit = ingredient === 'eggs' ? '' : ' cups';
        const displayName = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
        html += `<div>${displayName}: ${amount}${unit}</div>`;
    }
    html += '</div>';
    return html;
}


//*Baking timer*//
// Timer variables
let timerInterval = null;
let timeLeft = 0;
let totalTime = 0;

// Format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update the timer display
function updateTimerDisplay() {
    document.getElementById('timerDisplay').textContent = formatTime(timeLeft);
    
    // Update progress bar
    if (totalTime > 0) {
        const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;
        document.getElementById('timerProgress').style.background = 
            `linear-gradient(to right, #d2691e ${progressPercent}%, #f1e1c6 ${progressPercent}%)`;
    }
}

// Start the timer
function startTimer() {
    if (timerInterval) return; // Already running
    
    // Get time from inputs if not already set
    if (timeLeft <= 0) {
        const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
        const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
        timeLeft = (minutes * 60) + seconds;
        totalTime = timeLeft;
        
        if (timeLeft <= 0) {
            document.getElementById('timerResult').textContent = "Please enter a valid time!";
            return;
        }
    }
    
    // Start the countdown
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            document.getElementById('timerResult').textContent = "⏰ Time's up! Your baked goods are ready!";
        }
    }, 1000);
    
    document.getElementById('timerResult').textContent = "Timer started!";
}

// Pause the timer
function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById('timerResult').textContent = "Timer paused";
    }
}

// Reset the timer
function resetTimer() {
    // Clear any running timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Reset to input values
    const minutes = parseInt(document.getElementById('timerMinutes').value) || 15;
    const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
    timeLeft = (minutes * 60) + seconds;
    totalTime = timeLeft;
    
    updateTimerDisplay();
    document.getElementById('timerResult').textContent = "Timer reset";
}

// Initialize timer display
document.addEventListener('DOMContentLoaded', function() {
    // Set initial display
    const minutes = parseInt(document.getElementById('timerMinutes').value) || 15;
    const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
    timeLeft = (minutes * 60) + seconds;
    totalTime = timeLeft;
    updateTimerDisplay();
});

/**
 * Calculate cookie order total with discount tiers
 * @param {number} count - Number of cookies
 * @param {number} pricePer - Price per cookie
 * @returns {object} - Object with subtotal, discount, and total
 */
function calculateCookieOrder(count, pricePer) {
    // Local scope - discount tiers
    const discountTiers = [
        { min: 0, discount: 0 },
        { min: 12, discount: 0.1 }, // 10% off for 1 dozen
        { min: 24, discount: 0.15 }, // 15% off for 2 dozen
        { min: 36, discount: 0.2 }  // 20% off for 3 dozen
    ];
    
    const subtotal = count * pricePer;
    
    // Calculate discount based on tiers (local logic)
    let discountRate = 0;
    for (let i = discountTiers.length - 1; i >= 0; i--) {
        if (count >= discountTiers[i].min) {
            discountRate = discountTiers[i].discount;
            break;
        }
    }
    
    const discount = subtotal * discountRate;
    const total = subtotal - discount;
    
    return {
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        discountRate: (discountRate * 100).toFixed(0),
        total: total.toFixed(2)
    };
}

// DOM Interaction Functions
function calculateCupcakes() {
    const guests = parseInt(document.getElementById('guestCount').value) || 15;
    const appetiteSelect = document.getElementById('guestAppetite');
    const cupcakesPerGuest = parseFloat(appetiteSelect.value);
    const appetiteText = appetiteSelect.options[appetiteSelect.selectedIndex].text;
    
    // Calculate totals
    const totalCupcakes = Math.ceil(guests * cupcakesPerGuest);
 
    
    // Display results
    document.getElementById('cupcakeResult').innerHTML = `
        For <strong>${guests} guests</strong> with <strong>${appetiteText.toLowerCase()}</strong>:<br>
        You'll need <strong>${totalCupcakes} cupcakes</strong>.
    
    `;
}


function calculateCake() {
    const size = document.getElementById('cakeSize').value;
    const type = document.getElementById('cakeType').value;
    
    const ingredients = getCakeIngredients(size, type);
    const formatted = formatIngredients(ingredients);
    
    document.getElementById('cakeResult').innerHTML = `
        <strong>${type.charAt(0).toUpperCase() + type.slice(1)} Cake (${size})</strong><br>
        ${formatted}
    `;
}

function calculateCookiePrice() {
    const count = parseInt(document.getElementById('cookieCount').value) || 12;
    const pricePer = parseFloat(document.getElementById('cookiePrice').value) || 1.5;
    
    const result = calculateCookieOrder(count, pricePer);
    
    document.getElementById('priceResult').innerHTML = `
        <strong>${count} cookies</strong> at Sh${pricePer} each:<br>
        Subtotal: Sh${result.subtotal}<br>
        ${result.discountRate > 0 ? `Discount (${result.discountRate}%): -Sh${result.discount}<br>` : ''}
        Total: <strong>Sh${result.total}</strong>
    `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial values
    calculateCupcakes();
    calculateCake();
    calculateCookiePrice();
});

// ==============================================
// Part 3: Combining CSS Animations with JavaScript
// ==============================================

/**
 * Flip recipe card animation
 * Toggles CSS class to trigger 3D flip
 */
function flipCard() {
    const card = document.querySelector('.card');
    card.classList.toggle('flipped');
}

/**
 * Show order notification with animation
 * Adds CSS class to trigger fade-in and slide-up
 */
function showOrderNotification() {
    const notification = document.getElementById('orderNotification');
    
    // Add show class to trigger animation
    notification.classList.add('show');
    
    // Remove show class after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize page with some animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate demo cards on page load
    const demoCards = document.querySelectorAll('.demo-card');
    demoCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animate-fade-in');
    });
});