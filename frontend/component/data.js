export const upgrades = [
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
  

  export function getUpgradeCost(upgrade) {
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
  
    const costMultipliers = {
      1: 5,
      2: 3,
      3: 2,
      4: 2.5,
      5: 2.5,
      7: 3,
      8: 3,
      9: 4,
      10: 100,
    };
  
    return (
      baseCosts[upgrade.id] *
      Math.pow(costMultipliers[upgrade.id], upgrade.level)
    );
  }
  