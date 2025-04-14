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
const Category = require("./models/category");
const User = require("./models/user");
const Salon = require("./models/salon");
const Service = require("./models/service");
const RendezVous = require("./models/rendezVous");
const Review = require("./models/review");
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



//GET USERS
app.get("/account", authenticate, async (req, res) => {
  try {
    const user = await User.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user.id_user,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.mail,
      phone: user.phone,
      city: user.city,
      role: user.role,
    });
  } catch (error) {
    console.error("Account endpoint error:", error);
    res.status(500).json({
      error: "Internal server error",
      ...(process.env.NODE_ENV === "development" && { details: error.message }),
    });
  }
});

app.get("/admin/users", async (req, res) => {
  try {
    const users = await User.getAllUsers(req, res);
  } catch (error) {
    console.error("Route handler error:", error);

    if (!res.headersSent) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
});



//GET CATEGORIES
app.get("/allCategories", authenticate, async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    if (categories && categories.length > 0) {
      res.status(200).json(categories);
    } else {
      res.status(404).json({ message: "Pas trouvé" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/categories/:name", authenticate, async (req, res) => {
  try {
    const category = await Category.getCategoryByName(req.params.name);
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/categories/:name/salons", authenticate, async (req, res) => {
  try {
    const { name } = req.params;
    const { city } = req.query;

    const category = await Category.getCategoryByName(name);
    if (!category)
      return res.status(404).json({ message: "Catégorie non trouvée" });

    let salons;
    if (city) {
      salons = await Salon.getSalonsByCategoryAndCity(
        category.id_category,
        city
      );
    } else {
      salons = await Salon.getSalonsByCategoryId(category.id_category);
    }

    if (salons.length === 0)
      return res.status(404).json({ message: "Aucun salon trouvé" });

    res.status(200).json(salons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//GET SALONS
app.get("/salon/:salon", authenticate, async (req, res) => {
  try {
    const salonName = req.params.salon;
    const salon = await Salon.getSalonByName(salonName);

    if (!salon) {
      return res.status(404).json({ message: "Salon non trouvé" });
    }
    console.log("Données du salon récupérées :", salon);
    res.status(200).json(salon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/nameSalon", authenticate, async (req, res) => {
  try {
    const salon = await Salon.getNameSalon(req.params.id);
    salon
      ? res.status(200).json(salon)
      : res.status(404).json({
          message: "Pas trouvé",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/descritpionSalon", authenticate, async (req, res) => {
  try {
    const salon = await Salon.getDescriptionSalon(req.params.id);
    salon
      ? res.status(200).json(salon)
      : res.status(404).json({
          message: "Pas trouvé",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/adressSalon", authenticate, async (req, res) => {
  try {
    const salon = await Salon.getAdressSalon(req.params.id);
    salon
      ? res.status(200).json(salon)
      : res.status(404).json({
          message: "Pas trouvé",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/citySalon", authenticate, async (req, res) => {
  try {
    const salon = await Salon.getcitySalon(req.params.id);
    salon
      ? res.status(200).json(salon)
      : res.status(404).json({
          message: "Pas trouvé",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/pictureSalon", authenticate, async (req, res) => {
  try {
    const salon = await Salon.getPictureSalon(req.params.id);
    salon
      ? res.status(200).json(salon)
      : res.status(404).json({
          message: "Pas trouvé",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/reviewSalon", authenticate, async (req, res) => {
  try {
    const salon = await Salon.getReviewSalon(req.params.id);
    salon
      ? res.status(200).json(salon)
      : res.status(404).json({
          message: "Pas trouvé",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/allSalons", async (req, res) => {
  try {
    const salon = await Salon.getAllSalons();
    salon
      ? res.status(200).json(salon)
      : res.status(404).json({
          message: "Pas trouvé",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/allSalonsByLocalisation", authenticate, async (req, res) => {
  try {
    const salon = await Salon.getAllSalonsByLocalisation(req.params.id);
    salon
    ? res.status(200).json(salon)
      : res.status(404).json({
          message: "Pas trouvé",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/hairdresserSalon", authenticate, async (req, res) => {
  try {
    const salon = await Salon.getHairdresserSalon(req.params.id);
    salon
      ? res.status(200).json(salon)
      : res.status(404).json({
          message: "Pas trouvé",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/salonByCategories", authenticate, async (req, res) => {
  try {
    const salon = await Salon.getSalonByCategories(req.params.id);
    salon
      ? res.status(200).json(salon)
      : res.status(404).json({
          message: "Pas trouvé",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/salonByCategoriesByLocalisation", authenticate, async (req, res) => {
  try {
    const salon = await Salon.getSalonByCategoriesByLocalisation(req.params.id);
    salon
      ? res.status(200).json(salon)
      : res.status(404).json({
          message: "Pas trouvé",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//GET SERVICES
app.get("/service-details/:serviceId", authenticate, async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    console.log("Tentative de récupération du service avec ID:", serviceId);

    const serviceDetails = await Service.getServiceById(serviceId);

    if (!serviceDetails) {
      return res.status(404).json({ error: "Service non trouvé" });
    }

    console.log("Détails du service récupérés :", serviceDetails);
    res.status(200).json(serviceDetails);
  } catch (error) {
    console.error("Erreur lors de la récupération du service:", error);
    res.status(500).json({ error: error.message });
  }
});


//GET REVIEWS
app.get("/allReviews", async (req, res) => {
  try {
    const salon = await Review.getAllReviews();
    salon
      ? res.status(200).json(salon)
      : res.status(404).json({
          message: "Pas trouvé",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//GET APPOINTMENTS
app.get("/rendez-vous", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User ID:", userId);

    const result = await pool.query(
      `SELECT rv.id_rendezvous, rv.date, rv.time, s.name AS salon_name, srv.description AS service_name
       FROM Rendez_vous rv
       JOIN Salons s ON rv.id_salon = s.id_salon
       JOIN Services srv ON rv.id_service = srv.id_service
       WHERE rv.id_user = $1
       ORDER BY rv.date ASC, rv.time ASC`,
      [userId]
    );

    const appointments = result.rows;
    console.log("Appointments:", appointments);

    if (appointments.length === 0) {
      return res.status(404).json({ message: "Aucun rendez-vous trouvé" });
    }

    return res.json(appointments);
  } catch (err) {
    console.error("Erreur lors de la récupération des rendez-vous:", err);
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: err.message });
  }
});


//PATCH USER
app.patch("/users/:id", authenticate, async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    console.log("Received update request for user:", userId);
    console.log("Updates:", updates);

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userId !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only update your own profile" });
    }

    let updatedUser;
    if (updates.first_name) {
      updatedUser = await User.patchUserFirstName(userId, {
        first_name: updates.first_name,
      });
    }
    if (updates.last_name) {
      updatedUser = await User.patchUserLastName(userId, {
        last_name: updates.last_name,
      });
    }
    if (updates.mail) {
      updatedUser = await User.patchUserMail(userId, { mail: updates.mail });
    }
    if (updates.phone) {
      updatedUser = await User.patchUserPhone(userId, { phone: updates.phone });
    }

    if (!updatedUser) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    res.json({
      id: updatedUser.id_user,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.mail,
      phone: updatedUser.phone,
      city: updatedUser.city,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});


//POST APPOINTMENTS
app.post("/rendez-vous", authenticate, async (req, res) => {
  const { userId, salonId, serviceId, date, time } = req.body;

  if (!userId || !salonId || !serviceId || !date || !time) {
    return res.status(400).json({ error: "Tous les champs sont requis !" });
  }

  try {
    const userExists = await pool.query(
      "SELECT id_user FROM Users WHERE id_user = $1",
      [userId]
    );
    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const salonExists = await pool.query(
      "SELECT id_salon FROM Salons WHERE id_salon = $1",
      [salonId]
    );
    if (salonExists.rows.length === 0) {
      return res.status(404).json({ error: "Salon non trouvé" });
    }

    const serviceExists = await pool.query(
      "SELECT id_service FROM Services WHERE id_service = $1",
      [serviceId]
    );
    if (serviceExists.rows.length === 0) {
      return res.status(404).json({ error: "Service non trouvé" });
    }

    const createdAt = new Date();
    const updatedAt = new Date();

    console.log("Données reçues pour la réservation:", {
      userId,
      salonId,
      serviceId,
      date,
      time,
    });

    const newRdv = await RendezVous.createRendezVousClient({
      date,
      time,
      created_at: createdAt,
      updated_at: updatedAt,
      id_salon: salonId,
      id_user: userId,
      id_service: serviceId,
    });

    res.status(201).json(newRdv);
  } catch (error) {
    console.error("Erreur lors de la réservation:", error.message);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
});


//POST SALONS
app.post("/salons", authenticate, async (req, res) => {
  const { salon_name, address, city, picture, description, id_category } =
    req.body;

  console.log("Données reçues pour la création du salon:", req.body);

  if (
    !salon_name ||
    !address ||
    !city ||
    !picture ||
    !description ||
    !id_category
  ) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  try {
    const salon = await Salon.createSalon({
      name: salon_name,
      adress: address,
      city,
      description,
      id_category,
      picture,
    });

    res.status(201).json({ message: "Salon créé avec succès", salon });
  } catch (err) {
    console.error("Erreur lors de la création du salon:", err);
    res
      .status(500)
      .json({ error: "Erreur interne du serveur", details: err.message });
  }
});

app.post("/createSalon", authenticate, async (req, res) => {
  try {
    const newSalon = await Salon.createSalon(req.body);
    res.status(201).json(newSalon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//POST REVIEWS
app.post("/salon/:id_salon/reviews", authenticate, async (req, res) => {
  try {
    const { id_salon } = req.params;
    const { rating, description } = req.body;

    if (!rating || !description) {
      return res
        .status(400)
        .json({ error: "Rating and description are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const newReview = await Review.createReview({
      rating,
      description,
      id_salon,
    });
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    if (error.code === "23503") {
      return res.status(404).json({ error: "Salon not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

//POST LOGIN / REGISTER
app.post("/login", async (req, res) => {
  try {
    const { mail, password } = req.body;
    const user = await User.getUserByMail(mail);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id_user,
        mail: user.mail,
      },
      SECRET_KEY,
      {
        expiresIn: "2h",
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
    const { role, first_name, last_name, age, mail, phone, city, password } =
      req.body;
    const user = await User.createUser({
      role,
      first_name,
      last_name,
      age,
      mail,
      phone,
      city,
      password,
    });
    res.status(201).json({ message: "Utilisateur créé", user });
  } catch (error) {
    console.error("Erreur dans /register :", error.message);
    res.status(500).json({ error: error.message });
  }
});


//POST CATEGORIES
app.post("/createCategorie", async (req, res) => {
  try {
    const { nom, picture, description } = req.body;

    if (!nom || !picture || !description) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }

    const category = await Category.createCategory({
      nom,
      picture,
      description,
    });
    res.status(201).json({ message: "Catégorie créée", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//PUT CATEGORIES
app.put("/updateCategorie/:id", authenticate, async (req, res) => {
  try {
    const updatedCategorie = await Category.updateCategory(
      req.params.id,
      req.body
    );
    if (!updatedCategorie) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.status(200).json(updatedCategorie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//PUT SALONS
app.put("/updateSalon/:id", authenticate, async (req, res) => {
  try {
    const updateSalon = await Salon.updateSalon(req.params.id, req.body);
    res.status(200).json(updateSalon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//DELETE SALONS
app.delete("/deleteSalonPicture/:id", authenticate, async (req, res) => {
  try {
    await Salon.deleteSalonPicture(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/deleteSalonDescription/:id", authenticate, async (req, res) => {
  try {
    await Salon.deleteSalonDescription(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/salons/:id", authenticate, async (req, res) => {
  const id_salon = req.params.id;

  try {
    const result = await Salon.deleteSalon(id_salon);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error(`Error deleting salon ${id_salon}:`, error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});



//DELETE USERS
app.delete("/users/:id", authenticate, async (req, res) => {
  const userId = req.params.id;
  const currentUserId = req.user.id_user;

  try {
    const result = await User.deleteUser(userId, currentUserId);

    if (result.success) {
      return res.status(result.status).send();
    } else {
      return res.status(result.status).json({
        error: result.message,
      });
    }
  } catch (error) {
    console.error(`Route error deleting user ${userId}:`, error);
    res.status(500).json({
      error: "Unexpected server error",
    });
  }
});



//DELETE REVIEWS
app.delete("/reviews/:id", authenticate, async (req, res) => {
  const id_review = req.params.id;

  try {
    const result = await Review.deleteReview(id_review);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error(`Error deleting review ${id_review}:`, error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});



//DELETE CATEGORIES
app.delete("/deleteCategorie/:id", authenticate, async (req, res) => {
  try {
    const category = await Category.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    await Category.deleteCategorie(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
