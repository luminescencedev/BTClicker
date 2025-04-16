import { useEffect, useRef, useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

export default function BotMiner() {
    const { user, token, bitcoin, setBitcoin, setBotProgress, setBots } = useContext(AuthContext);
    const [bots, setLocalBots] = useState(0);
    const [botPower, setLocalBotPower] = useState(0);
    const [botInterval, setBotInterval] = useState(5000);
    const [botProgress, setLocalBotProgress] = useState(0);  // Local state for bot progress
    const botProgressRef = useRef(botProgress);
    const bitcoinRef = useRef(bitcoin); // Ref to keep track of bitcoin outside render

    const fetchBotUpgrades = async () => {
        try {
            const res = await fetch(`http://localhost:3001/status/${user.username}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            const ramLevel = data.upgrades.find((u) => u.name === "Ram")?.level || 0;
            const coolingLevel = data.upgrades.find((u) => u.name === "Cooling")?.level || 0;
            const cpuLevel = data.upgrades.find((u) => u.name === "CPU")?.level || 0;
            const botFarmLevel = data.upgrades.find((u) => u.name === "Bot Farm")?.level || 0;

            const baseBotPower = 0.000001;
            const ramBonus = baseBotPower * Math.pow(1.3, ramLevel);
            const coolingMultiplier = Math.pow(1.1, coolingLevel);
            const totalBotPower = ramBonus * coolingMultiplier;
            const cpuMultiplier = 1 + cpuLevel * 0.05;
            const interval = 5000 / cpuMultiplier;

            setLocalBotPower(totalBotPower);
            setLocalBots(botFarmLevel);
            setBotInterval(interval);

            // Optionnel : sync dans le contexte si d'autres composants en ont besoin
            setBots(botFarmLevel);
        } catch (err) {
            console.error("Error fetching bot data:", err);
        }
    };

    useEffect(() => {
        if (user) fetchBotUpgrades();
    }, [user, token]);

    useEffect(() => {
        bitcoinRef.current = bitcoin;  // Update bitcoin reference on change
    }, [bitcoin]);

    useEffect(() => {
        if (bots > 0) {
            let progress = botProgressRef.current;

            const botMining = setInterval(() => {
                progress += 100 / (botInterval / 100);
                if (progress >= 100) {
                    progress = 0; // Reset the progress

                    // Add the bot mining reward to bitcoin, don't reset it
                    const mined = bots * botPower;
                    const newBitcoin = bitcoinRef.current + mined;

                    // Update bitcoin value and context
                    setBitcoin(newBitcoin);
                    bitcoinRef.current = newBitcoin;

                    try {
                        // Update backend with the new bitcoin value
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

                botProgressRef.current = progress; // Update the progress ref
                setLocalBotProgress(progress); // Update the local state
            }, 100); // Update every 100ms for smoother progression

            return () => clearInterval(botMining); // Clear interval on component unmount
        }
    }, [bots, botInterval, botPower, token]);

    return (
        <div className="flex flex-col items-center justify-center">
            <h2>Bot</h2>
            <p>Number of bots: {bots}</p>
            <p>Bot Power: {botPower.toFixed(6)}</p>
            <div className="bot-progress-container">
                <div
                    id="bot-progress-bar"
                    style={{
                        width: `${botProgress}%`,
                        height: "20px",
                        backgroundColor: "green",
                        transition: "width 0.1s", // Optional transition for smoothness
                    }}
                ></div>
            </div>
        </div>
    );
}
