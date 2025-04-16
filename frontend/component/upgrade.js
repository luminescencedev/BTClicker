import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function Upgrade() {
    const { user, token } = useContext(AuthContext);
    const { bitcoin, setBitcoin } = useContext(AuthContext);
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
    }, [user, token]);

    const handleUpgrade = async (upgradeId) => {
        const upgrade = upgrades.find((u) => u.id === upgradeId);
        const cost = Math.pow(1.15, upgrade.level) * 0.0001; // Coût exponentiel

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
                        Authorization: `Bearer ${token}`,
                    },
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
                            <p>Price : {(Math.pow(1.15, upgrade.level) * 0.0001).toFixed(6)}</p>
                            <p>Value : {upgrade.description}</p>
                        </section>
                    </article>
                ))}
            </div>
        </div>
    );
}