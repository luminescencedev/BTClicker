import { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";

export default function Market() {
    const { user, token } = useContext(AuthContext);
    const { bitcoin, setBitcoin } = useContext(AuthContext);
    const [marketControlLevel, setMarketControlLevel] = useState(0);
    const [isBetting, setIsBetting] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const [marketCooldown, setMarketCooldown] = useState(60);

    const [randomNumber, setRandomNumber] = useState(null);
    const [displayedNumber, setDisplayedNumber] = useState(null);
    const [betResultMessage, setBetResultMessage] = useState("");

    const cooldownRef = useRef(null);
    const randomIntervalRef = useRef(null);
    const displayIntervalRef = useRef(null);

    const maxCooldown = 60;
    const cooldownReduction = 5 * marketControlLevel;
    const cooldownTime = Math.max(maxCooldown - cooldownReduction, 10);

    const betAmount = bitcoin * (0.1 * marketControlLevel);

    useEffect(() => {
        const fetchMarketUpgrades = async () => {
            try {
                const res = await fetch(`http://localhost:3001/status/${user.username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error('Failed to fetch market upgrades');

                const data = await res.json();
                const marketControl = data.upgrades.find((u) => u.name === "Market Control");
                setMarketControlLevel(marketControl?.level || 0);
            } catch (err) {
                console.error("Error fetching market upgrades:", err);
            }
        };

        if (user) {
            fetchMarketUpgrades();
        }
    }, [user, token]);

    useEffect(() => {
        if (!cooldown && !isBetting) {
            randomIntervalRef.current = setInterval(() => {
                const rand = Math.floor(Math.random() * 10) + 1;
                setRandomNumber(rand);
                setDisplayedNumber(rand);
            }, 50);
        }

        return () => clearInterval(randomIntervalRef.current);
    }, [cooldown, isBetting]);

    const stopRandomNumber = () => {
        clearInterval(randomIntervalRef.current);
    };

    const handleBet = (value) => {
        if (cooldown) return;

        stopRandomNumber();
        const finalRand = randomNumber;
        setIsBetting(true);

        displayIntervalRef.current = setInterval(() => {
            setDisplayedNumber(Math.floor(Math.random() * 10) + 1);
        }, 100);

        const isSuccess = finalRand > 5;
        let progress = 0;

        const animationInterval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
                clearInterval(animationInterval);
                clearInterval(displayIntervalRef.current);
                setDisplayedNumber(finalRand);

                const winnings = betAmount;

                if (!isSuccess && value === "down") {
                    setBitcoin(prev => prev + winnings);
                    setBetResultMessage(`You won! You gained ${winnings.toFixed(7)} BTC.`);
                } else if (isSuccess && value === "up") {
                    setBitcoin(prev => prev + winnings);
                    setBetResultMessage(`You won! You gained ${winnings.toFixed(7)} BTC.`);
                } else {
                    setBitcoin(prev => prev - winnings);
                    setBetResultMessage(`You lost! You lost ${winnings.toFixed(7)} BTC.`);
                }

                setIsBetting(false);
                setCooldown(true);
                setMarketCooldown(cooldownTime);
            }
        }, 100);
    };

    useEffect(() => {
        if (cooldown) {
            cooldownRef.current = setInterval(() => {
                setMarketCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(cooldownRef.current);
                        setCooldown(false);
                        setBetResultMessage("");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(cooldownRef.current);
    }, [cooldown]);

    if (marketControlLevel === 0) {
        return (
            <div className="market-container">
                <h2>Market Betting</h2>
                <p>⚠️ You must unlock <strong>Market Control</strong> to use this feature.</p>
                <p>Upgrade it from the store or your profile to start betting!</p>
            </div>
        );
    }

    return (
        <div id="market">
            <span id="spanwallet">
                <img src="/wallet.svg" alt="Wallet" />
                Bitcoin : {bitcoin.toFixed(7)}
            </span>

            <h2>Market Betting</h2>
            <article>
                <div>
                    <h3>Your Current Balance: {bitcoin.toFixed(7)} BTC</h3>
                    <p>Bet Amount: {betAmount.toFixed(7)} BTC</p>
                </div>
            </article>

            <div>
                {isBetting && <p>Betting...</p>}
                {cooldown && <p>Cooldown: {marketCooldown}s</p>}
            </div>

            <div>
                <p>Random Number: {displayedNumber}</p>
            </div>

            <div>
                <p>{betResultMessage}</p>
            </div>

            <div id="divbutton">
                <button
                    onClick={() => handleBet("up")}
                    disabled={isBetting || cooldown}>
                    ↑ 5
                </button>
                <button
                    onClick={() => handleBet("down")}
                    disabled={isBetting || cooldown}>
                    ↓ 5 
                </button>
            </div>
        </div>
    );
}
