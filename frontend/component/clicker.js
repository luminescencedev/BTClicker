import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function Clicker() {
    const { user, token } = useContext(AuthContext);
    const { bitcoin, bots, botPower, botProgress,setBitcoin,setBotPower,setBotProgress, setBots } = useContext(AuthContext);
    // const [bitcoin, setBitcoin] = useState(0);
    // const [bots, setBots] = useState(0);
    // const [botProgress, setBotProgress] = useState(0); // Progression de la barre (0% à 100%)
    // const [botPower, setBotPower] = useState(0.000001); // Puissance de minage des bots réduite
    const [clickPower, setClickPower] = useState(0.0000001); // Puissance de clic par défaut réduite
    const [botInterval, setBotInterval] = useState(10000); // Intervalle par défaut pour les bots (10s)

    // Charger la progression depuis l'API
    const fetchProgression = async () => {
        if (user) {
            try {
                const response = await fetch(`http://localhost:3001/status/${user.username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();

                    setBitcoin(data.wallet.balance || 0);

                    // Récupérer les niveaux des améliorations
                    let ramLevel = data.upgrades.find((u) => u.name === "Ram")?.level || 0;
                    let cpuLevel = data.upgrades.find((u) => u.name === "CPU")?.level || 0;
                    let coolingLevel = data.upgrades.find((u) => u.name === "Cooling")?.level || 0;
                    let motherboardLevel = data.upgrades.find((u) => u.name === "Motherboard")?.level || 0;
                    let graphicsLevel = data.upgrades.find((u) => u.name === "Graphics Card")?.level || 0;
                    let botFarmLevel = data.upgrades.find((u) => u.name === "Bot Farm")?.level || 0;

                    // Calculer la puissance des bots
                    const baseBotPower = 0.000001; // Réduction de la puissance initiale
                    const ramBonus = baseBotPower * Math.pow(1.3, ramLevel); // RAM augmente la puissance
                    const coolingMultiplier = Math.pow(1.1, coolingLevel); // Cooling multiplie la puissance
                    const totalBotPower = ramBonus * coolingMultiplier;
                    setBotPower(totalBotPower);

                    // Calculer l'intervalle des bots
                    let cpuMultiplier = 1 + cpuLevel * 0.05; // CPU réduit l'intervalle
                    setBotInterval(10000 / cpuMultiplier); // Intervalle de base augmenté

                    // Calculer la puissance de clic
                    let baseClickPower = 0.0000001; // Réduction de la puissance initiale
                    let motherboardBonus = 0 // Motherboard augmente la puissance
                    if (motherboardLevel > 0) {
                        motherboardBonus = baseClickPower * Math.pow(1.4, motherboardLevel); 
                    }
                    let graphicsMultiplier = 1 + graphicsLevel * 0.4; // Graphics multiplie la puissance
                    let totalClickPower = (baseClickPower + motherboardBonus) * graphicsMultiplier;
                    
                    setClickPower(totalClickPower);

                    // Nombre de bots
                    setBots(botFarmLevel);
                } else {
                    console.error("Failed to fetch progression:", response.status);
                }
            } catch (error) {
                console.error("Error fetching progression:", error);
            }
        }
    };

    useEffect(() => {
        fetchProgression();
    }, [user, token]);

    // Fonction pour miner un bitcoin avec un clic
    const mineBitcoin = async () => {
        const newBitcoin = bitcoin + clickPower;
        setBitcoin(newBitcoin);

        try {
            await fetch(`http://localhost:3001/progressionClicker`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ wallet: { balance: newBitcoin } }),
            });
        } catch (error) {
            console.error("Error updating progression:", error);
        }
    };

    // Fonction pour les bots qui minent automatiquement
    useEffect(() => {
        if (bots > 0) {
            let progress = 0;
            const botMining = setInterval(() => {
                progress += 100 / (botInterval / 100); // Incrémente la progression
                if (progress >= 100) {
                    progress = 0; // Réinitialise la progression
                    const newBitcoin = bitcoin + bots * botPower; // Chaque bot mine en fonction de sa puissance
                    setBitcoin(newBitcoin);

                    try {
                        fetch(`http://localhost:3001/progressionClicker`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ wallet: { balance: newBitcoin } }),
                        });
                    } catch (error) {
                        console.error("Error updating progression:", error);
                    }
                }
                setBotProgress(progress); // Met à jour la progression de la barre
            }, 100);

            return () => clearInterval(botMining); // Nettoyer l'intervalle lorsque le composant est démonté ou que `bots` change
        }
    }, [bots, botInterval, botPower, bitcoin, token]);

    return (
        <div id="clicker">
            <span id="spanwallet">
                <img src="/wallet.svg" alt="Wallet" />
                Bitcoin : {bitcoin.toFixed(7)}
            </span>
            <div>
                <h2>Mining</h2>
                <article>
                    <button onClick={mineBitcoin}>Mine a Bitcoin</button>
                    <p>Click Power: {clickPower.toFixed(9)}</p>
                </article>
            </div>
            <div className="flex flex-col items-center justify-center">
                <h2>Bot</h2>
                <p>Number of bots: {bots}</p>
                <p>Bot Power: {botPower.toFixed(6)}</p>
                <div className="bot-progress-container">
                    <div
                        id="bot-progress-bar"
                        style={{ width: `${botProgress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}