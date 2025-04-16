import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function Upgrade() {
    const { user, token, bitcoin, setBitcoin } = useContext(AuthContext);
    const [upgrades, setUpgrades] = useState([]);

    useEffect(() => {
        const fetchProgression = async () => {
            if (user) {
                const response = await fetch(`http://localhost:3001/status/${user.username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();
                setBitcoin(data.wallet.balance || 0);
                setUpgrades(data.upgrades || []);
            }
        };
        fetchProgression();
    }, [user, token, setBitcoin]);

    // Fonction de calcul du coût réel selon ID et niveau
    const getUpgradeCost = (upgrade) => {
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
            1: 1.6,
            2: 1.3,
            3: 1.6,
            4: 1.5,
            5: 1.9,
            7: 5,
            8: 2.4,
            9: 1.7,
            10: 10,
        };

        const base = baseCosts[upgrade.id] || 0.0001;
        const multiplier = costMultipliers[upgrade.id] || 1.15;

        return base * Math.pow(multiplier, upgrade.level);
    };

    const handleUpgrade = async (upgradeId) => {
        const upgrade = upgrades.find((u) => u.id === upgradeId);
        const cost = getUpgradeCost(upgrade);

        if (bitcoin >= cost) {
            const newBitcoin = bitcoin - cost;
            const newUpgrades = upgrades.map((u) =>
                u.id === upgradeId ? { ...u, level: u.level + 1 } : u
            );

            setBitcoin(newBitcoin);
            setUpgrades(newUpgrades);

            try {
                await fetch(`http://localhost:3001/progressionUpgrade`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                        wallet: { balance: newBitcoin },
                        upgrades: newUpgrades,
                    }),
                });
            } catch (error) {
                console.error("Error updating progression:", error);
            }
        }
    };
    const col1 = upgrades.slice(0, 4);
    const col2 = upgrades.slice(4, 6);
    const col3 = upgrades.slice(6, 8);
    return (
        <div id="upgrade">
            <span id="spanwallet">
                <img src="/wallet.svg" alt="Wallet" />
                Bitcoin : {bitcoin.toFixed(7)}
            </span>
            <div>
                <h2>Upgrades</h2>
                
                {upgrades.map((upgrade) => (
                    <article key={upgrade.id}>
                        <button onClick={() => handleUpgrade(upgrade.id)}>
                            {upgrade.name} : lvl {upgrade.level}
                        </button>
                        <section>
                            <p>Price : {getUpgradeCost(upgrade).toFixed(7)}</p>
                            <p>Value : {upgrade.description}</p>
                        </section>
                    </article>
                ))}
            </div>
        </div>
    );
}
