const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config({ path: 'd:/Sai Tech/Aula/backend/.env' });

async function update() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'aula_db'
    });
    
    await pool.query("UPDATE hero_banners SET ctaLink = 'modal'");
    console.log('Updated hero_banners table with ctaLink = modal');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

update();
