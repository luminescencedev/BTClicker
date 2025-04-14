const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

class Reviews {
 

  static async getAllReviews() {
    const result = await pool.query("SELECT * FROM Reviews");
    return result.rows;
  }


  static async createReview({ rating, description, id_salon }) {
    try {
      const result = await pool.query(
        `INSERT INTO Reviews (rating, description, created_at, updated_at, id_salon)
         VALUES ($1, $2, NOW(), NOW(), $3) 
         RETURNING *`,
        [rating, description, id_salon]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async deleteReview(id) {
    try {
      const result = await pool.query(
        "DELETE FROM Reviews WHERE id_review = $1 RETURNING *", 
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Reviews;
