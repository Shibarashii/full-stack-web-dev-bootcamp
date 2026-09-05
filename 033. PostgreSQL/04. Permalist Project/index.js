import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'permalist',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let items;

const getItems = async () => {
  const result = await db.query('SELECT * FROM items ORDER BY id ASC');
  items = result.rows;
  console.log(items);
};

const addItem = async (item) => {
  const result = await db.query('INSERT INTO items (title) VALUES ($1)', [
    item,
  ]);
  if (result.rows.length > 0) {
    console.log('Successfully inserted row');
  } else {
    console.log('Error inserting row');
  }
};

const updateItem = async (updatedItemTitle, id) => {
  const result = await db.query('UPDATE items SET title=$1 WHERE id=$2', [
    updatedItemTitle,
    id,
  ]);
  if (result.rows.length > 0) {
    console.log('Successfully updated row');
  } else {
    console.log('Error updating row.');
  }
};

const deleteItem = async (id) => {
  const result = await db.query('DELETE FROM items WHERE id=$1', [id]);
  if (result.rows.length > 0) {
    console.log('Successfully deleted row');
  } else {
    console.log('Error deleting row');
  }
};

app.get('/', async (req, res) => {
  await getItems();
  res.render('index.ejs', {
    listTitle: 'Today',
    listItems: items,
  });
});

app.post('/add', async (req, res) => {
  await addItem(req.body.newItem);
  res.redirect('/');
});

app.post('/edit', async (req, res) => {
  await updateItem(req.body.updatedItemTitle, req.body.updatedItemId);
  res.redirect('/');
});

app.post('/delete', async (req, res) => {
  await deleteItem(req.body.deleteItemId);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
