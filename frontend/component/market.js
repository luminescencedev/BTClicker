import { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";

export default function Market() {
    const { user, token } = useContext(AuthContext);
    const { bitcoin, setBitcoin } = useContext(AuthContext);
    const [marketControlLevel, setMarketControlLevel] = useState(0); // Niveau de Market Control
    const [isBetting, setIsBetting] = useState(false); // Si un pari est en cours
    const [cooldown, setCooldown] = useState(false); // Si le cooldown est actif
    const [marketCooldown, setMarketCooldown] = useState(60); // Cooldown initial
    const [betDirection, setBetDirection] = useState("up"); // "up" ou "down"
    const [randomNumber, setRandomNumber] = useState(null); // Nombre aléatoire en cours
    const [betResultMessage, setBetResultMessage] = useState(""); // Message de résultat
    const cooldownRef = useRef(null);
    const randomIntervalRef = useRef(null); // Référence de l'intervalle pour le nombre aléatoire

    const maxCooldown = 60; // Cooldown de base de 60 secondes
    const cooldownReduction = 5 * marketControlLevel; // Réduction du cooldown par niveau de Market Control
    const cooldownTime = Math.max(maxCooldown - cooldownReduction, 10); // Ne pas descendre sous 10 secondes

    // Calcul du betAmount en fonction du niveau de Market Control
    const betAmount = bitcoin * (0.1 * marketControlLevel); // 10% * Market Control Level

    useEffect(() => {
        // Fetch market upgrades
        const fetchMarketUpgrades = async () => {
            try {
                const res = await fetch(`http://localhost:3001/status/${user.username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch market upgrades');
                }

                const data = await res.json();
                console.log("Fetched data:", data); // Log data for debugging

                if (data && data.upgrades) {
                    const marketControl = data.upgrades.find((u) => u.name === "Market Control");
                    setMarketControlLevel(marketControl?.level || 0);
                } else {
                    console.error("Data structure is incorrect or upgrades not found.");
                }
            } catch (err) {
                console.error("Error fetching market upgrades:", err);
            }
        };

        if (user) {
            fetchMarketUpgrades();
        }
    }, [user, token]);

    // Fonction qui génère un nombre aléatoire (entre 0 et 10)
    useEffect(() => {
        if (!cooldown) {
            // Lancer l'animation du nombre aléatoire
            randomIntervalRef.current = setInterval(() => {
                setRandomNumber(Math.floor(Math.random() * 10)+1); // Un nombre entre 0 et 10
            }, 50); // Change toutes les 100ms
        }

        // Nettoyage de l'intervalle après que le pari soit effectué ou que le cooldown soit activé
        return () => {
            clearInterval(randomIntervalRef.current);
        };
    }, [isBetting, cooldown]);

    // Fonction qui arrête le nombre aléatoire après la mise
    const stopRandomNumber = () => {
        clearInterval(randomIntervalRef.current);
    };

    // Fonction qui gère un pari
    const handleBet = (value) => {
        if (cooldown) return; // Si un pari est en cours, on ne peut pas parier

        setIsBetting(true); // Commencer le pari
        const rand = randomNumber; // Utiliser le nombre généré aléatoirement

        // Si le nombre est supérieur à 5, il gagne
        const isSuccess = rand > 5;
        

        let progress = 0;
        const animationInterval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
                clearInterval(animationInterval);
                if (!isSuccess && value === "down") {
                    const winnings = betAmount;
                    setBitcoin(prev => prev + winnings); // Gain
                    setBetResultMessage(`You won! You gained ${winnings.toFixed(7)} BTC.`);
                } else if (isSuccess && value === "up") {
                    const winnings = betAmount;
                    setBitcoin(prev => prev + winnings); // Gain
                    setBetResultMessage(`You won! You gained ${winnings.toFixed(7)} BTC.`);
                } else {
                    setBitcoin(prev => prev - betAmount); // Perte
                    setBetResultMessage(`You lost! You lost ${betAmount.toFixed(7)} BTC.`);
                }
                setIsBetting(false);
                setCooldown(true); // Déclencher le cooldown après le pari
                stopRandomNumber(); // Arrêter l'intervalle aléatoire après la fin de l'animation
            }
        }, 100);

        // Déclencher le cooldown
        setMarketCooldown(cooldownTime);
    };

    // Déclenchement du cooldown après un pari
    useEffect(() => {
        if (cooldown) {
            cooldownRef.current = setInterval(() => {
                setMarketCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(cooldownRef.current);
                        setCooldown(false); // Fin du cooldown
                        setBetResultMessage(""); // Masquer le message de résultat après le cooldown
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(cooldownRef.current);
    }, [cooldown]);

   

    return (
        <div className="market-container">
            <h2>Market Betting</h2>
            <article>
                <div>
                    <h3>Your Current Balance: {bitcoin} BTC</h3>
                    <p>Bet Amount: {betAmount.toFixed(7)} BTC</p>
                </div>
            </article>
            

            <div>
                {isBetting && <p>Betting...</p>}
                {cooldown && <p>Cooldown: {marketCooldown}s</p>}
            </div>

            <div>
                <p>Random Number: {randomNumber}</p> {/* Nombre qui change constamment */}
            </div>

            <div>
                <p>{betResultMessage}</p> {/* Message pour le résultat du pari */}
            </div>

            <div>
                <button 
                    onClick={() => handleBet("up")} 
                    disabled={isBetting || cooldown}>
                    +5
                </button>
                <button 
                    onClick={() => handleBet("down")} 
                    disabled={isBetting || cooldown}>
                    -5
                </button>
            </div>
        </div>
    );
}
