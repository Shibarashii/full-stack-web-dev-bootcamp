import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

// console.log(result.rows);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  const result = await db.query('SELECT country_code FROM visited_countries');
  const countries = result.rows.map((r) => r.country_code);

  res.render('index.ejs', {
    countries: countries,
    total: countries.length,
  });
});

app.post('/add', async (req, res) => {
  const guess = req.body.country;
  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
      [guess.toLowerCase()],
    );
    if (result.rows.length > 0) {
      const country_code = result.rows[0].country_code;
      const insertQuery = await db.query(
        'INSERT INTO visited_countries (country_code) VALUES ($1)',
        [country_code],
      );
      if (insertQuery.rowCount > 0) {
        console.log('Successfully inserted row.');
      }
    } else {
      console.log('Wrong guess.');
    }
  } catch (error) {
    console.log('Error:' + error.stack);
  } finally {
    res.redirect('/');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
