import { useEffect } from "react";
import Head from "next/head";

export default function Game() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/mathHandler.js"; // script in /public
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Crypto Mining Incremental</title>
      </Head>

      <div id="game-container">
        <div id="header">
          <h1>Crypto Mining Incremental</h1>
          <p>Reach 21,000,000 to win!</p>
        </div>

        <div id="resources">0.000001</div>

        <div id="click-area">
          <h3>Click to Mine!</h3>
          <p>
            Current click power: <span id="click-power">0.000001</span>
          </p>
        </div>

        <div id="production-info">
          <p>
            Production: <span id="production-rate">0.000001</span>/ tic
          </p>
          <p>
            Bots: <span id="bot-count">1</span>
          </p>
        </div>

        <div class="bot-progress-container">
          <div id="bot-progress-bar"></div>
        </div>

        <h2>Upgrades</h2>
        <div id="upgrades"></div>

        <div id="market">
          <h2>Market</h2>
          <p>
            Max bet: <span id="max-bet">5%</span> | Cooldown:
            <span id="cooldown">60</span>s
          </p>
          <button id="bet-button" disabled>
            Bet (Cooldown)
          </button>
        </div>

        <div id="win-message">
          <h2>Congratulations!</h2>
          <p>You've reached 21,000,000!</p>
          <button
            onClick={() =>
              (document.getElementById("win-message").style.display = "none")
            }
          >
            Continue Playing
          </button>
        </div>
      </div>

      {/* ✅ Correct location for global styles */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          
        }
        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #121212;
          color: #e0e0e0;
        }
        #game-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        #header {
          text-align: center;
          margin-bottom: 20px;
        }
        #resources {
          font-size: 24px;
          font-weight: bold;
          color: #4caf50;
          text-align: center;
          padding: 10px;
          background-color: #1e1e1e;
          border-radius: 5px;
        }
        #click-area {
          text-align: center;
          padding: 20px;
          background-color: #1e1e1e;
          border-radius: 5px;
          cursor: pointer;
          user-select: none;
        }
        #click-area:active {
          background-color: #2a2a2a;
        }
        #upgrades {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 10px;
        }
        .upgrade {
          padding: 15px;
          background-color: #1e1e1e;
          border-radius: 5px;
          transition: all 0.2s;
        }
        .upgrade:hover {
          background-color: #2a2a2a;
        }
        .upgrade-name {
          font-weight: bold;
          margin-bottom: 5px;
          color: #bb86fc;
        }
        .upgrade-level {
          color: #03dac6;
        }
        .upgrade-button {
          margin-top: 10px;
          padding: 5px 10px;
          background-color: #3700b3;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
        }
        .upgrade-button:disabled {
          background-color: #555;
          cursor: not-allowed;
        }
        #market {
          margin-top: 20px;
          padding: 15px;
          background-color: #1e1e1e;
          border-radius: 5px;
        }
        #win-message {
          display: none;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #4caf50;
          color: white;
          padding: 20px;
          border-radius: 5px;
          z-index: 100;
          text-align: center;
        }
        .bot-progress-container {
          width: 100%;
          height: 20px;
          background-color: #ddd;
          border-radius: 10px;
          overflow: hidden;
          margin: 10px 0;
        }

        #bot-progress-bar {
          height: 100%;
          width: 0%;
          background-color: #4caf50;
          transition: width 0.1s linear;
        }
      `}</style>
    </>
  );
}
