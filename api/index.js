const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const express = require("express");
const User = require("./models/user");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
app.use(express.json());

const cors = require("cors");
const corsOptions = {
  origin: "*",
  methods: ["POST", "GET", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

app.get("/status/:username", async (req, res) => {
  const username = req.params.username; // Récupérer le username depuis les paramètres
  try {
    const result = await User.getProgressionByUsername(username); // Appeler la méthode du modèle
    if (result.status === 404) {
      return res.status(404).json(result.progression);
    }
    res.status(200).json(result.progression); // Retourner toutes les données de progression
  } catch (error) {
    console.error(`Route error fetching status for user ${username}:`, error);
    res.status(500).json({
      error: "Unexpected server error",
    });
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.getAllUsersWithBalances(); // Appeler la méthode du modèle
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

app.get("/status/:username", async (req, res) => {
    const username = req.params.username;
    try {
        const result = await User.getProgressionByUsername(username);
        console.log("Progression fetched for user:", username, result); // Log des données
        if (result.status === 404) {
            return res.status(404).json(result.progression);
        }
        res.status(200).json(result.progression);
    } catch (error) {
        console.error(`Error fetching status for user ${username}:`, error);
        res.status(500).json({ error: "Unexpected server error" });
    }
});

app.patch("/progressionClicker", authenticate, async (req, res) => {
    console.log("Received request to update progression:", req.body); 
    const username = req.user.username;
    const { wallet } = req.body;

    try {
        
        await User.updateProgression(username, { wallet });
        res.status(200).json({ message: "Progression updated successfully" });
    } catch (error) {
        console.error("Error updating progression:", error); // Log des erreurs
        res.status(500).json({ error: "Unexpected server error" });
    }
});

app.patch("/progressionUpgrade", authenticate, async (req, res) => {
    console.log("Received request to update progression:", req.body); 
    const username = req.user.username;
    const { wallet, upgrades } = req.body;

    try {
        
        await User.updateProgression(username, { wallet, upgrades });
        res.status(200).json({ message: "Progression updated successfully" });
    } catch (error) {
        console.error("Error updating progression:", error); // Log des erreurs
        res.status(500).json({ error: "Unexpected server error" });
    }
});


app.post("/give", authenticate, async (req, res) => {
  const username = req.user?.username; // 🔐 On prend depuis le token
  const { amount } = req.body;

  if (!username || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount or username." });
  }

  try {
    const user = await User.getUserByUsername(username);

    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }

    // Assure-toi de récupérer la balance actuelle de l'utilisateur (avec await)
    const walletData = await User.getWallet(user.id); // Utilisation de await pour obtenir la valeur retournée
    const currentWallet = walletData.status === 200 ? parseFloat(walletData.wallet.balance) : 0;

    // Assure-toi que l'amount est bien un nombre
    const numericAmount = parseFloat(amount);

    // Si la conversion échoue, retourne une erreur
    if (isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
    }

    // Additionner la nouvelle valeur à la balance existante
    const newWallet = currentWallet + numericAmount;

    // Mise à jour de la progression avec la nouvelle balance
    await User.updateProgression(username, { wallet: { balance: newWallet } });

    // Retourner une réponse avec la nouvelle balance
    res.status(200).json({ message: `Added ${numericAmount} to ${username}'s wallet.`, newWallet });
} catch (error) {
    console.error("Error in /give:", error);
    res.status(500).json({ error: "Unexpected server error" });
}

});



//POST LOGIN / REGISTER
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.getUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id_user,
        username: user.username,
      },
      SECRET_KEY,
      {
        expiresIn: "4h",
      }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/register", async (req, res) => {
  try {
    console.log("Données reçues :", req.body);
    const {username, password } =
      req.body;
    const user = await User.createUser({
      username,
      password,
    });
    res.status(201).json({ message: "Utilisateur créé", user });
  } catch (error) {
    console.error("Erreur dans /register :", error.message);
    res.status(500).json({ error: error.message });
  }
});



//DELETE USERS
app.delete("/users/:username", authenticate, async (req, res) => {
    const username = req.params.username;
    const currentUsername = req.user.username;

    try {
        const result = await User.deleteUser(username, currentUsername);

        if (result.success) {
            return res.status(result.status).send();
        } else {
            return res.status(result.status).json({
                error: result.message,
            });
        }
    } catch (error) {
        console.error(`Error deleting user ${username}:`, error);
        res.status(500).json({
            error: "Unexpected server error",
        });
    }
});




const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});