const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

class Category {
  // GET /categoryById (Public, Admin, User)
  static async getCategoryById(id) {
    const result = await pool.query("SELECT * FROM Categories WHERE id_category = $1", [id]);
    return result.rows[0] || null;
  }

    // GET /categoryByName (Public, Admin, User)
    static async getCategoryByName(name) {
      const result = await pool.query("SELECT * FROM Categories WHERE name = $1", [name]);
      return result.rows[0] || null;
    }

  // GET /allCategories (Public, Admin, User)
  static async getAllCategories() {
    const result = await pool.query("SELECT * FROM Categories");
    return result.rows;
  }

  
}

module.exports = Category;
