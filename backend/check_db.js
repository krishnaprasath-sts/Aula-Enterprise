const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: 'd:/Sai Tech/Aula/backend/.env' });

async function checkDb() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'aula_db',
    });

    const [rows] = await pool.query('SELECT * FROM enquiries');
    console.log("Enquiries count:", rows.length);
    console.log("Enquiries:", rows);
    
    const [crows] = await pool.query('SELECT * FROM contact_submissions');
    console.log("Contact Submissions count:", crows.length);
    console.log("Contact Submissions:", crows);

    process.exit(0);
  } catch (e) {
    console.error("DB Error:", e.message);
    process.exit(1);
  }
}
checkDb();
