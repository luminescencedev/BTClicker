const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

class RendezVous {
    
    static async createRendezVousClient({ date, time, created_at, updated_at, id_salon, id_user, id_service }) {
  try {
    console.log('Insertion dans la base de données avec les paramètres :', {
      date, time, created_at, updated_at, id_salon, id_user, id_service,
    });

    const result = await pool.query(
      'INSERT INTO Rendez_vous (date, time, created_at, updated_at, id_salon, id_user, id_service) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [date, time, created_at, updated_at, id_salon, id_user, id_service]
    );

    console.log('Résultat de l\'insertion:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur SQL lors de l\'insertion du rendez-vous:', error.message);
    throw new Error('Erreur lors de la création du rendez-vous');
  }
}


   
}

module.exports = RendezVous;
