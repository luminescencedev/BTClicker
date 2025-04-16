import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [bitcoin, setBitcoin] = useState(0);
const [bots, setBots] = useState(0);
const [botPower, setBotPower] = useState(0.0000159);
const [botProgress, setBotProgress] = useState(0);
const botInterval = 10000; // 10 secondes par exemple


  useEffect(() => {
    // Récupérer le token et l'utilisateur depuis localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser)); // Convertir l'utilisateur en objet
    }
  }, []);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData)); // Sauvegarder l'utilisateur
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (bots > 0) {
      let progress = 0;
  
      const botMining = setInterval(() => {
        progress += 100 / (botInterval / 100);
        if (progress >= 100) {
          progress = 0;
  
          const newBitcoin = bitcoin + bots * botPower;
          setBitcoin(newBitcoin);
  
          try {
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
  
        setBotProgress(progress);
      }, 100);
  
      return () => clearInterval(botMining);
    }
  }, [bots, botInterval, botPower, bitcoin, token]);
  

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
    setBotProgress
  }}
>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;