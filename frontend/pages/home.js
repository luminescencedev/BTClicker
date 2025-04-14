import { useState } from "react";
import Terminal from "../component/Terminal";
import Clicker from "../component/clicker";
import Upgrade from "../component/upgrade";

export default function Home() {
  const [activeComponent, setActiveComponent] = useState(null); 

  return (
    <> 
      <main className="homePage h-screen w-screen">
        <div className="h-[50%] w-full p-1">
          <Terminal setActiveComponent={setActiveComponent} /> 
        </div>
        <div className="h-[50%] w-full">
          {activeComponent === "clicker" ? (
            <Clicker />
          ) : activeComponent === "upgrade" ? (
            <Upgrade />
          ) : (
            <>
              {/* Ajoutez d'autres composants ici si nécessaire */}
            </>
          )}
        </div>
      </main>
    </>
  );
}