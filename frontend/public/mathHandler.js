// Game data - your original JSON
const upgrades = [
  {
    id: 1,
    name: "CPU",
    description: "Increase the bot mining frequency",
    level: 0,
  },
  {
    id: 2,
    name: "Ram",
    description: "Increase the bot mining power",
    level: 0,
  },
  {
    id: 3,
    name: "Cooling",
    description: "Increase the bot power multiplier",
    level: 0,
  },
  {
    id: 4,
    name: "Motherboard",
    description: "Increase the player mining power",
    level: 0,
  },
  {
    id: 5,
    name: "Graphics Card",
    description: "Increase the player mining multiplier",
    level: 0,
  },
  {
    id: 7,
    name: "Market Control",
    description: "Increases the percentage the player can bet on the market",
    level: 1,
  },
  {
    id: 8,
    name: "Loan Shark",
    description: "Decreases the cooldown between market bets",
    level: 0,
  },
  {
    id: 9,
    name: "Bot Farm",
    description: "Increase the number of bots",
    level: 0,
  },
  {
    id: 10,
    name: "Quantum Tap",
    description: "Add 10% of passive bot production to your click power",
    level: 0,
  }
  
];

// Game state
const game = {
  resources: 0.000001,
  lastUpdate: Date.now(),
  lastBetTime: 0,
  botCount: 1,
  lastBotTick: Date.now(),
  hasUnlockedQuantumTap: false,
clicksInLastSecond: 0,

};

// Helper function to get upgrade by ID
function getUpgrade(id) {
  return upgrades.find((u) => u.id === id);
}

// Game formulas
const formulas = {
  getProduction: () => {
    let basePower = 0.00001;

    const ramLevel = getUpgrade(2).level;
    const coolingLevel = getUpgrade(3).level;
    const cpuLevel = getUpgrade(1).level;
    const botFarmLevel = getUpgrade(9).level;
    

    // RAM: starts with a strong boost, slows down after level 5
    const ramBonus =
      basePower * Math.pow(1.5, ramLevel);

    // Cooling: smoother exponential, helps multiply RAM
    const coolingMult = Math.pow(1.2, coolingLevel);

    // CPU: affects how frequently bots mine, strong early, smooth later
    const cpuMult =
      1 +
      (Math.pow(1.4, Math.min(cpuLevel, 4)) - 1);

    // Bot Farm: now each level gives more bots, especially early
    

    if (botFarmLevel === 0) return 0;


    return (basePower + ramBonus) * coolingMult * cpuMult * botFarmLevel;
  },

  getClickPower: () => {
    const motherboardLevel = getUpgrade(4).level;
    const graphicsLevel = getUpgrade(5).level;
    const basePower = 0.000001;
    const quantumLevel = getUpgrade(10).level;
  
    // Motherboard: stronger at low levels, slows down later
    const motherboardBonus =
      basePower * Math.pow(1.5, motherboardLevel) - 0.000001;
  
    // Graphics: gradual multiplier that builds slowly
    const graphicsMult = 1 + graphicsLevel * 0.6;
  
    // Quantum: adds 10% of passive production per level to click
    const quantumBonus =
      quantumLevel > 0 ? formulas.getProduction() * (quantumLevel * 0.1) : 0;
  
    return ((basePower + motherboardBonus) * graphicsMult) + quantumBonus;
  }
  ,

  getMaxBetPercent: () => {
    return 0.1 * getUpgrade(7).level;
  },

  getMarketCooldown: () => {
    return Math.max(20, 120 - getUpgrade(8).level * 15);
  },

  getUpgradeCost: (upgrade) => {
    const baseCosts = {
      1: 0.0002, // CPU
      2: 0.0002, // RAM
      3: 0.0004, // Cooling
      4: 0.00001, // Motherboard
      5: 0.00003, // Graphics
      7: 0.0005, // Market Control
      8: 0.001, // Loan Shark
      9: 0.00015, // Bot Farm
      10: 1, // Quantum Tap

    };

    // Custom cost multipliers
    const costMultipliers = {
      1: 5, // CPU
      2: 3, // RAM
      3: 2, // Cooling
      4: 2.5, // 🔥 Motherboard (now scales much faster)
      5: 2.5, // 🔥 Graphics Card (cost grows faster than its small boost)
      7: 3, // Market Control
      8: 3, // Loan Shark
      9: 4, // Bot Farm
      10: 100, // Quantum Tap (scales faster)

    };

    

    return (
      baseCosts[upgrade.id] *
      Math.pow(costMultipliers[upgrade.id], upgrade.level)
    );
  },
  getBotInterval: () => {
    const baseInterval = 5000; // 5 seconds
    const cpuLevel = getUpgrade(1).level;
  
    // Each CPU level reduces interval by 10%, minimum 1s
    const reduction = Math.min(cpuLevel * 0.19, 0.99); // max 80% reduction
    return Math.max(50, baseInterval * (1 - reduction));
  },
  
};
// DOM elements
const resourcesEl = document.getElementById("resources");
const clickPowerEl = document.getElementById("click-power");
const productionRateEl = document.getElementById("production-rate");
const botCountEl = document.getElementById("bot-count");
const upgradesEl = document.getElementById("upgrades");
const maxBetEl = document.getElementById("max-bet");
const cooldownEl = document.getElementById("cooldown");
const betButton = document.getElementById("bet-button");
const clickArea = document.getElementById("click-area");
const winMessage = document.getElementById("win-message");

// Format numbers for display
function formatNumber(num) {
  if (num >= 1000) {
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return num.toFixed(7);
}

setInterval(() => {
  if (!game.hasUnlockedQuantumTap && game.clicksInLastSecond >= 10) {
    game.hasUnlockedQuantumTap = true;
    alert("Achievement Unlocked: Quantum Tap is now available!");
    createUpgradeElements(); // refresh upgrades UI
  }
  game.clicksInLastSecond = 0;
}, 1000);


// Update all UI elements
function updateUI() {
  resourcesEl.textContent = formatNumber(game.resources);
  clickPowerEl.textContent = formatNumber(formulas.getClickPower());
  productionRateEl.textContent = formatNumber(formulas.getProduction());
  botCountEl.textContent = getUpgrade(9).level;
  maxBetEl.textContent = Math.round(formulas.getMaxBetPercent() * 100) + "%";
  cooldownEl.textContent = formulas.getMarketCooldown();

  // Update upgrade buttons
  upgrades.forEach((upgrade) => {
    const button = document.querySelector(
      `.upgrade-button[data-id="${upgrade.id}"]`
    );
    if (button) {
      const cost = formulas.getUpgradeCost(upgrade);
      button.textContent = `Upgrade (${formatNumber(cost)})`;
      button.disabled = game.resources < cost;
    }
  });

  // Update bet button
  const timeSinceLastBet = (Date.now() - game.lastBetTime) / 1000;
  const cooldown = formulas.getMarketCooldown();

  if (timeSinceLastBet >= cooldown) {
    betButton.textContent = "Place Bet";
    betButton.disabled = false;
  } else {
    const remaining = Math.ceil(cooldown - timeSinceLastBet);
    betButton.textContent = `Cooldown (${remaining}s)`;
    betButton.disabled = true;
  }
}

// Create upgrade elements
function createUpgradeElements() {
  upgradesEl.innerHTML = "";

  upgrades.forEach((upgrade) => {
    if (upgrade.id === 10 && !game.hasUnlockedQuantumTap) return;

    const cost = formulas.getUpgradeCost(upgrade);
    const div = document.createElement("div");
    div.className = "upgrade";
    div.innerHTML = `
                      <div class="upgrade-name">${upgrade.name}</div>
                      <div class="upgrade-description">${
                        upgrade.description
                      }</div>
                      <div class="upgrade-level">Level: ${upgrade.level}</div>
                      <button class="upgrade-button" data-id="${
                        upgrade.id
                      }">Upgrade (${formatNumber(cost)})</button>
                  `;
    upgradesEl.appendChild(div);
  });

  // Add event listeners to upgrade buttons
  document.querySelectorAll(".upgrade-button").forEach((button) => {
    button.addEventListener("click", () => {
      const upgradeId = parseInt(button.getAttribute("data-id"));
      purchaseUpgrade(upgradeId);
    });
  });
}

// Purchase upgrade function
function purchaseUpgrade(upgradeId) {
  const upgrade = getUpgrade(upgradeId);
  const cost = formulas.getUpgradeCost(upgrade);

  if (game.resources >= cost) {
    game.resources -= cost;
    upgrade.level++;

    // Special case for Bot Farm
    if (upgradeId === 9) {
      game.botCount = upgrade.level;
    }

    updateUI();
  }
}

// Market bet function
function placeBet() {
  const currentTime = Date.now();
  const timeSinceLastBet = (currentTime - game.lastBetTime) / 1000;
  const cooldown = formulas.getMarketCooldown();

  if (timeSinceLastBet >= cooldown) {
    const maxBetPercent = formulas.getMaxBetPercent();
    const betAmount = game.resources * maxBetPercent;

    if (Math.random() < 0.45) {
      // 45% chance to win
      game.resources += betAmount;
      alert(`You won your bet! +${formatNumber(betAmount)}`);
    } else {
      game.resources -= betAmount;
      alert(`You lost your bet! -${formatNumber(betAmount)}`);
    }

    game.lastBetTime = currentTime;
    updateUI();
  }
}

// Click handler
clickArea.addEventListener("click", () => {
  game.resources += formulas.getClickPower();
  game.clicksInLastSecond++;
  updateUI();
});


// Bet button handler
betButton.addEventListener("click", placeBet);
const botProgressBar = document.getElementById("bot-progress-bar");

// Game loop
function gameLoop() {
  const now = Date.now();
  const interval = formulas.getBotInterval();
  const timeSinceLastTick = now - game.lastBotTick;

  // Update bot progress bar
  const progress = Math.min((timeSinceLastTick / interval) * 100, 100);
  botProgressBar.style.width = progress + "%";

  // If it's time for bots to generate resources
  if (timeSinceLastTick >= interval) {
    game.resources += formulas.getProduction();
    game.lastBotTick = now;
  }

  game.lastUpdate = now;
  updateUI();

  if (game.resources >= 21000000) {
    winMessage.style.display = "block";
  }

  requestAnimationFrame(gameLoop);
}


// Initialize the game
createUpgradeElements();
updateUI();
gameLoop();
