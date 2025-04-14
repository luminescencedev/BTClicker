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
    role,
    first_name,
    last_name,
    age,
    mail,
    phone,
    city,
    password,
  }) {
    const created_at = new Date();
    const updated_at = new Date();
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (role, first_name, last_name, age, mail, phone, city, password, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        role,
        first_name,
        last_name,
        age,
        mail,
        phone,
        city,
        hashedPassword,
        created_at,
        updated_at,
      ]
    );
    return result.rows[0];
  }

  // In your user controller
  static async getAllUsers(req, res) {
    try {
      const result = await pool.query(`
      SELECT 
        id_user,
        role,
        first_name,
        last_name,
        age,
        mail,
        phone,
        city,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
    `);

      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Apprends a écrire ptn" });
    }
  }

  // In models/user.js - keep your existing queries but ensure they return id_user
  static async getUserById(id_user) {
    try {
      const result = await pool.query(
        `SELECT id_user, first_name, last_name, age, mail, phone, city, role 
         FROM users WHERE id_user = $1`,
        [id_user]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error("Database query error:", err);
      throw err; // This will trigger the 500 error response
    }
  }

  static async getUserByMail(mail) {
    const result = await pool.query("SELECT * FROM Users WHERE mail = $1", [
      mail,
    ]);
    return result.rows[0];
  }

  

  static async patchUserLastName(id, { last_name }) {
    const result = await pool.query(
      "UPDATE Users SET last_name = $1 WHERE id_user = $2 RETURNING *",
      [last_name, id]
    );
    return result.rows[0];
  }

  static async patchUserFirstName(id, { first_name }) {
    const result = await pool.query(
      "UPDATE Users SET first_name = $1 WHERE id_user = $2 RETURNING *",
      [first_name, id]
    );
    return result.rows[0];
  }

  static async patchUserMail(id, { mail }) {
    const result = await pool.query(
      "UPDATE Users SET mail = $1 WHERE id_user = $2 RETURNING *",
      [mail, id]
    );
    return result.rows[0];
  }

  static async patchUserPhone(id, { phone }) {
    const result = await pool.query(
      "UPDATE Users SET phone = $1 WHERE id_user = $2 RETURNING *",
      [phone, id]
    );
    return result.rows[0];
  }

  // In your user controller
  static async deleteUser(id_user, currentUserId) {
    try {
      // 1. Check if user exists
      const userCheck = await pool.query(
        "SELECT id_user, role FROM Users WHERE id_user = $1",
        [id_user]
      );

      if (userCheck.rows.length === 0) {
        return { success: false, status: 404, message: "User not found" };
      }

      // 2. Prevent self-deletion
      if (currentUserId === parseInt(id_user)) {
        return {
          success: false,
          status: 400,
          message: "Cannot delete your own account",
        };
      }

      // 3. Check for salon ownership
      const salonCheck = await pool.query(
        "SELECT id_salon FROM Users WHERE id_user = $1 AND id_salon IS NOT NULL",
        [id_user]
      );

      if (salonCheck.rows.length > 0) {
        return {
          success: false,
          status: 400,
          message: "User owns a salon. Transfer salon ownership first.",
        };
      }

      // 4. Delete user
      await pool.query("DELETE FROM Users WHERE id_user = $1", [id_user]);

      return {
        success: true,
        status: 204,
        message: "User deleted successfully",
      };
    } catch (error) {
      console.error("Delete user error:", error);

      // Handle foreign key constraints
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
