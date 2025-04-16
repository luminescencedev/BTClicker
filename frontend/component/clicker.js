import { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";

export default function Clicker() {
    const { user, token } = useContext(AuthContext);
    const { bitcoin, setBitcoin } = useContext(AuthContext);
    const [clickPower, setClickPower] = useState(0.0000001);
    const bitcoinRef = useRef(bitcoin);

    useEffect(() => {
        bitcoinRef.current = bitcoin;
    }, [bitcoin]);

    const fetchProgression = async () => {
        if (user) {
            try {
                const response = await fetch(`http://localhost:3001/status/${user.username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setBitcoin(data.wallet.balance || 0);

                    const motherboardLevel = data.upgrades.find((u) => u.name === "Motherboard")?.level || 0;
                    const graphicsLevel = data.upgrades.find((u) => u.name === "Graphics Card")?.level || 0;

                    const baseClickPower = 0.000001;
                    const motherboardBonus = motherboardLevel > 0 ? baseClickPower * Math.pow(1.4, motherboardLevel) : 0;
                    const graphicsMultiplier = 1 + graphicsLevel * 0.4;
                    const totalClickPower = (baseClickPower + motherboardBonus) * graphicsMultiplier;
                    setClickPower(totalClickPower);
                }
            } catch (error) {
                console.error("Error fetching progression:", error);
            }
        }
    };

    useEffect(() => {
        fetchProgression();
    }, [user, token]);

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

    return (
        <>
        <span id="spanwallet">
                <img src="/wallet.svg" alt="Wallet" />
                Bitcoin : {bitcoin.toFixed(7)}
        </span>
        <div id="clicker">

                <h2>Mining</h2>
                <article>
                    <button onClick={mineBitcoin}>Mine a Bitcoin</button>
                    <p>Click Power: {clickPower.toFixed(9)}</p>
                </article>
        </div>
        </>
    );
}
