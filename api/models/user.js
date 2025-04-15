const { Pool } = require("pg");
const bcrypt = require("bcrypt");

require("dotenv").config();
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

class User {
  static async createUser({
    username,
    password,
  }) {
    const progression = {
        "upgrades":
        [
            {
                "id": 1,
                "name": "CPU",
                "description": "Increase the bot mining frequency ",
                "level": 1
            },
            {
                "id": 2,
                "name": "Ram",
                "description": "Increase the bot mining power",
                "level": 1
            },
            {
                "id": 3,
                "name": "Cooling",
                "description": "Increase the bot power multiplier",
                "level": 1
            },
            {
                "id": 4,
                "name": "Motherboard",
                "description": "Increase the player mining power ",
                "level": 1
            },
            {
                "id": 5,
                "name": "Graphics Card",
                "description": "Increase the player mining multiplier",
                "level": 1
            },
            {
                "id": 7,
                "name":"Market Control",
                "description": "Increases the percentage the player can bet on the market",
                "level": 1
            },
            {
                "id": 8,
                "name": "Loan Shark",
                "description": "Decreases the cooldown between market bets",
                "level": 1
            },
            {
                "id": 9,
                "name": "Bot Farm",
                "description": "Increase the number of bots",
                "level": 1
            }
        ],
        "wallet":
        {
            "balance": 1000
        },
        "achievements":
        [
            {
                "id": 1,
                "name": "Achievement 1",
                "description": "This is the first achievement."
                
            },
            {
                "id": 2,
                "name": "Achievement 2",
                "description": "This is the second achievement."
                
            },
            {
                "id": 3,
                "name": "Achievement 3",
                "description": "This is the third achievement."
                
            }
        ],
        "market":
        {
            "trend":"up",
            "steps": 5
            
        }
    
    
    };
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, password, progression) 
       VALUES ($1, $2, $3::jsonb) RETURNING *`,
      [
        username,
        hashedPassword,
        JSON.stringify(progression),
      ]
    );
    return result.rows[0];
  }

  static async getId(username) {
    try {
      const result = await pool.query(
        `SELECT id_user FROM users WHERE username = $1`,
        [username]
      );
      if (result.rows.length === 0) {
        return null; // User not found
      }
      return result.rows[0].id_user; // Return the user ID
    } catch (err) {
      console.error("Database query error:", err);
      throw err;
    }
  }

  static async getProgressionByUsername(username) {
    try {
      const result = await pool.query(
        "SELECT progression FROM users WHERE username = $1",
        [username]
      );

      if (result.rows.length === 0) {
        return {
          status: 404,
          progression: { error: "User not found or progression missing" },
        };
      }

      return {
        status: 200,
        progression: result.rows[0].progression,
      };
    } catch (err) {
      console.error("DB error in getProgressionByUsername:", err);
      throw err;
    }
  }
  
  
  
  static async getWallet(userId) {
    try {
      const [rows] = await db.query("SELECT progression -> wallet -> balance FROM users WHERE user_id = ?", [userId]);
      
      if (rows.length === 0) {
        return {
          status: 404,
          wallet: { error: "Wallet not found" },
        };
      }

      return {
        status: 200,
        wallet: {
          balance: rows[0].balance,
        },
      };
    } catch (err) {
      console.error("DB error in getWallet:", err);
      throw err;
    }
  }

  // In your user controller
  static async getAllUsers(req, res) {
    try {
      const result = await pool.query(`
      SELECT *
      FROM users
    `);

      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error" });
    }
  }

  // In models/user.js - keep your existing queries but ensure they return id_user
  static async getUserById(id_user) {
    try {
      const result = await pool.query(
        `SELECT *
         FROM users WHERE id_user = $1`,
        [id_user]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error("Database query error:", err);
      throw err;
    }
  }
  
  static async getUserByUsername(username) {
    try {
      const result = await pool.query(
        `SELECT * FROM users WHERE username = $1`,
        [username]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error("Database query error:", err);
      throw err;
    }
  }
  

  // In your user controller
  static async deleteUser(id_user, currentUserId) {
    try {
      // 1. Check if user exists
      const userCheck = await pool.query(
        "SELECT id_user FROM Users WHERE id_user = $1",
        [id_user]
      );

      if (userCheck.rows.length === 0) {
        return { success: false, status: 404, message: "User not found" };
      }

      if (currentUserId === parseInt(id_user)) {
        return {
          success: false,
          status: 400,
          message: "Cannot delete your own account",
        };
      }

      await pool.query("DELETE FROM Users WHERE id_user = $1", [id_user]);

      return {
        success: true,
        status: 204,
        message: "User deleted successfully",
      };
    } catch (error) {
      console.error("Delete user error:", error);

      if (error.code === "23503") {
        return {
          success: false,
          status: 400,
          message: "User has related records. Delete those first.",
        };
      }

      return {
        success: false,
        status: 500,
        message: "Server error during deletion",
      };
    }
  }
}
module.exports = User;
