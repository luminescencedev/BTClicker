import { useState } from "react";
import Terminal from "../component/Terminal";
import Clicker from "../component/clicker";
import Upgrade from "../component/upgrade";
import BotMiner from "../component/botMiner";
import Market from "../component/market";


export default function Home() {
  const [activeComponent, setActiveComponent] = useState(null); 

  return (
    <> 
      <main className="homePage h-screen w-screen">
        <div className="h-[50%] w-full p-1">
          <Terminal setActiveComponent={setActiveComponent} /> 
        </div>
        <div id="seconddiv">
          {activeComponent === "clicker" ? (
            <>
            <Clicker />
            <BotMiner />
            </>
          ) : activeComponent === "upgrade" ? (
            <Upgrade />
          ): activeComponent === "market" ? (
              <Market />
            ) : (
            <>
            </>
          )}
        </div>
      </main>
    </>
  );
}