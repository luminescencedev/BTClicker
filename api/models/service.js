const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

class Service {
  

  static async getServiceById(id) {
    const result = await pool.query(
      "SELECT * FROM Services WHERE id_service = $1",
      [id]
    ); // Récupérer le service par ID
    return result.rows[0] || null; // Retourner le service trouvé, ou null si aucun service trouvé
  }
}

module.exports = Service;
