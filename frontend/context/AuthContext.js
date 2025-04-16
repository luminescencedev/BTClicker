import { createContext, useState, useEffect } from "react";
import useBotMiner from "../hooks/useBotMiner"; // chemin à adapter

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [bitcoin, setBitcoin] = useState(0);
  const [bots, setBots] = useState(0);
  const [botPower, setBotPower] = useState(0.0000159);
  const [botProgress, setBotProgress] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
  
    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
  
      // 💡 Fetch les données du user une fois connecté
      fetch(`http://localhost:3001/status/${parsedUser.username}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setBitcoin(data.wallet.balance || 0);
  
          // Optionnel : initialiser les upgrades pour botPower/bots aussi si besoin
          const botFarmLevel = data.upgrades.find((u) => u.name === "Bot Farm")?.level || 0;
          setBots(botFarmLevel);
  
          const ram = data.upgrades.find((u) => u.name === "Ram")?.level || 0;
          const cooling = data.upgrades.find((u) => u.name === "Cooling")?.level || 0;
  
          const baseBotPower = 0.000001;
          const ramBonus = baseBotPower * Math.pow(1.3, ram);
          const coolingMultiplier = Math.pow(1.1, cooling);
          setBotPower(ramBonus * coolingMultiplier);
        })
        .catch((err) => console.error("Erreur lors du chargement du wallet :", err));
    }
  }, []);
  

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // 👉 Utilisation du hook pour gérer le minage automatique
  useBotMiner({ user, token, bitcoin, setBitcoin, setBots });

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        bitcoin,
        setBitcoin,
        bots,
        setBots,
        botPower,
        setBotPower,
        botProgress,
        setBotProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
