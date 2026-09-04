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

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let currentUserId = 1;

let users;

async function checkVisisted() {
  const result = await db.query(
    'SELECT country_code FROM visited_countries WHERE user_id=$1',
    [currentUserId],
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log('Countries: ' + countries);
  return countries;
}

async function getUsers() {
  const result = await db.query('SELECT * FROM users');
  users = result.rows;
}

app.get('/', async (req, res) => {
  await getUsers();
  let currUser = users.find((user) => user.id === currentUserId);
  // console.log(currUser);
  const countries = await checkVisisted();
  res.render('index.ejs', {
    countries: countries,
    total: countries.length,
    users: users,
    color: currUser.color,
  });
});

app.post('/add', async (req, res) => {
  const input = req.body['country'];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()],
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        'INSERT INTO visited_countries (user_id, country_code) VALUES ($1, $2)',
        [currentUserId, countryCode],
      );
      res.redirect('/');
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post('/user', async (req, res) => {
  if (req.body.add) {
    res.render('new.ejs');
  } else {
    currentUserId = Number(req.body.user);
    console.log('Current user ID: ' + currentUserId);
    res.redirect('/');
  }
});

app.post('/new', async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  const result = await db.query(
    'INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id',
    [req.body.name, req.body.color],
  );
  currentUserId = result.rows[0].id;
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
