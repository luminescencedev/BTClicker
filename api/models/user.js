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
                "level": 0
            },
            {
                "id": 2,
                "name": "Ram",
                "description": "Increase the bot mining power",
                "level": 0
            },
            {
                "id": 3,
                "name": "Cooling",
                "description": "Increase the bot power multiplier",
                "level": 0
            },
            {
                "id": 4,
                "name": "Motherboard",
                "description": "Increase the player mining power ",
                "level": 0
            },
            {
                "id": 5,
                "name": "Graphics Card",
                "description": "Increase the player mining multiplier",
                "level": 0
            },
            {
                "id": 7,
                "name":"Market Control",
                "description": "Increases the percentage the player can bet on the market",
                "level": 0
            },
            {
                "id": 8,
                "name": "Loan Shark",
                "description": "Decreases the cooldown between market bets",
                "level": 0
            },
            {
                "id": 9,
                "name": "Bot Farm",
                "description": "Increase the number of bots",
                "level": 0
            }
        ],
        "wallet":
        {
            "balance": 0
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
        ]
    
    
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
        return null;
      }
      return result.rows[0].id_user;
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
        progression: result.rows[0].progression
      };
    } catch (err) {
      console.error("DB error in getProgressionByUsername:", err);
      throw err;
    }
  }

  static async updateProgression(username, progression) {
    try {
        console.log("Updating progression for user:", username); 
        console.log("Progression data:", progression); 

        for (const key in progression) {
            if (progression.hasOwnProperty(key)) {
                await pool.query(
                    `UPDATE users SET progression = jsonb_set(progression, $1, $2::jsonb) WHERE username = $3`,
                    [`{${key}}`, JSON.stringify(progression[key]), username]
                );
            }
        }
    } catch (err) {
        console.error("DB error in updateProgression:", err);
        throw err;
    }
}

  
static async getWallet(userId) {
  try {
      const result = await pool.query(
          "SELECT progression->'wallet'->>'balance' AS balance FROM users WHERE id = $1",
          [userId]
      );

      if (result.rows.length === 0) {
          return {
              status: 404,
              wallet: { error: "Wallet not found" },
          };
      }

      return {
          status: 200,
          wallet: {
              balance: parseFloat(result.rows[0].balance) || 0,
          },
      };
  } catch (err) {
      console.error("DB error in getWallet:", err);
      throw err;
  }
}


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

  static async getAllUsersWithBalances() {
    try {
      const result = await pool.query(`
        SELECT username, progression->'wallet'->>'balance' AS balance
        FROM users
      `);

      const users = result.rows.map((row) => ({
        username: row.username,
        balance: parseFloat(row.balance) || 0,
      }));

      users.sort((a, b) => b.balance - a.balance);

      return users;
    } catch (err) {
      console.error("DB error in getAllUsersWithBalances:", err);
      throw err;
    }
  }

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
  

  static async deleteUser(username, currentUsername) {
    try {
        const userCheck = await pool.query(
            "SELECT id FROM users WHERE username = $1",
            [username]
        );

        if (userCheck.rows.length === 0) {
            return { success: false, status: 404, message: "User not found" };
        }

        if (currentUsername === parseInt(username)) {
            return {
                success: false,
                status: 400,
                message: "Cannot delete your own account",
            };
        }
        await pool.query("DELETE FROM users WHERE username = $1", [username]);

        return {
            success: true,
            status: 204,
            message: "User deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting user:", error);

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
