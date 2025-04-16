// hooks/useBotMiner.js
import { useEffect, useRef, useState } from "react";

export default function useBotMiner({ user, token, bitcoin, setBitcoin, setBots, setBotProgress }) {
    const [bots, setLocalBots] = useState(0);
    const [botPower, setLocalBotPower] = useState(0);
    const [botProgress, setLocalBotProgress] = useState(0);
    const [botInterval, setBotInterval] = useState(5000);

    const bitcoinRef = useRef(bitcoin);
    const progressRef = useRef(botProgress);

    useEffect(() => {
        bitcoinRef.current = bitcoin;
    }, [bitcoin]);

    useEffect(() => {
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

                setBots(botFarmLevel); // sync global context if needed
            } catch (err) {
                console.error("Error fetching bot data:", err);
            }
        };

        if (user) fetchBotUpgrades();
    }, [user, token, setBots]);

    useEffect(() => {
        if (bots > 0) {
            let progress = progressRef.current;

            const botMining = setInterval(() => {
                progress += 100 / (botInterval / 100);
                if (progress >= 100) {
                    progress = 0;
                    const mined = bots * botPower;
                    const newBitcoin = bitcoinRef.current + mined;

                    setBitcoin(newBitcoin);
                    bitcoinRef.current = newBitcoin;

                    try {
                        fetch(`http://localhost:3001/progressionClicker`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ wallet: { balance: newBitcoin } } ),
                        });
                    } catch (error) {
                        console.error("Error updating progression:", error);
                    }
                }

                progressRef.current = progress;
                setLocalBotProgress(progress);
                setBotProgress(progress); // Update context state as well
            }, 100);

            return () => clearInterval(botMining);
        }
    }, [bots, botInterval, botPower, token, setBitcoin, setBotProgress]);

    return { bots, botPower, botProgress };
}
