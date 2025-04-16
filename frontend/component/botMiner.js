import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function BotMiner() {
  const { bots, botPower, botProgress } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center">
      <h2>Bot</h2>
      <p>Number of bots: {bots}</p>
      <p>Bot Power: {botPower.toFixed(6)}</p>
      <div className="bot-progress-container" style={{ width: "100%", border: "1px solid #ccc" }}>
        <div
          id="bot-progress-bar"
          style={{
            width: `${botProgress}%`,
            height: "20px",
            backgroundColor: "green",
            transition: "width 0.1s",
          }}
        ></div>
      </div>
    </div>
  );
}
