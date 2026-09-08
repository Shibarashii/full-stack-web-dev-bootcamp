import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const app = express();
const port = 3000;

pg.types.setTypeParser(1082, (value) => value);

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "booknotes",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// https://covers.openlibrary.org/b/$key/$value-$size.jpg
const baseUrl = "https://covers.openlibrary.org/b/";

let books = [
  // {
  //   id: 1,
  //   title: 'Meditations',
  //   author: 'Marcus Aurelius',
  //   isbn: '978-0812968255',
  //   dateRead: new Date(),
  //   rating: 9,
  //   review: 'This is an amazing book by the then emperor Marcus Aurelius.',
  // },
  // {
  //   id: 2,
  //   title: 'Rich Dad Poor Dad',
  //   author: 'Robert T. Kiyosaki',
  //   isbn: '978-1612681139',
  //   dateRead: new Date(),
  //   rating: 5,
  //   review: 'Not amazing',
  // },
];

const getAllBooksSortBy = async (column, order) => {
  try {
    const result = await db.query(
      `SELECT * FROM books ORDER BY ${column} ${order}`,
    );
    console.log("Succesfully retrieved books.");
    books = result.rows;
    console.log(books);
  } catch (error) {
    console.error(error);
  }
};

const addBook = async (params) => {
  try {
    await db.query(
      "INSERT INTO books (title, author, isbn, date_read, rating, review) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        params.title,
        params.author,
        params.isbn,
        params.dateRead,
        params.rating,
        params.review,
      ],
    );

    console.log("Successfully added book.");
    return { added: true };
  } catch (error) {
    console.error(error);

    return {
      added: false,
      message: [error.message, error.detail, error.hint]
        .filter(Boolean)
        .join(" "),
    };
  }
};

const getBookById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      const book = result.rows[0];
      console.log("Successfully retrieved book with id " + id);
      return book;
    }
  } catch (error) {
    console.log(error);
  }
};

const updateBook = async (id, params) => {
  try {
    await db.query(
      "UPDATE books SET title = $1, author = $2, isbn = $3, date_read = $4, rating = $5, review = $6 WHERE id = $7",
      [
        params.title,
        params.author,
        params.isbn,
        params.date_read,
        params.rating,
        params.review,
        id,
      ],
    );

    return { updated: true };
  } catch (error) {
    console.error(error);

    return {
      updated: false,
      message: [error.message, error.detail, error.hint]
        .filter(Boolean)
        .join(" "),
    };
  }
};

const deleteBook = async (id) => {
  try {
    const result = await db.query("DELETE FROM books WHERE id = $1", [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
};

app.get("/", async (req, res) => {
  await getAllBooksSortBy("id", "ASC");
  res.render("index.ejs", { books: books });
});

app.get("/add", (req, res) => {
  const message = req.query.success === "1" ? "Book added successfully." : null;

  res.render("addBook.ejs", { message });
});

let order;
app.get("/filter", async (req, res) => {
  order = order == "ASC" ? "DESC" : "ASC";
  console.log(req.query.sort, order);
  await getAllBooksSortBy(req.query.sort, order);
  res.render("index.ejs", { books: books });
});

app.get("/books/:id", async (req, res) => {
  const book = await getBookById(req.params.id);

  if (!book) {
    res.status(404).send("Book not found.");
    return;
  }

  console.log(book);
  res.render("viewBook.ejs", { book: book });
});

app.post("/books/:id/update", async (req, res) => {
  const result = await updateBook(req.params.id, req.body);

  if (result.updated) {
    res.redirect(`/books/${req.params.id}`);
    return;
  }

  res.status(500).send(result.message);
});

app.post("/books/:id/delete", async (req, res) => {
  const deleted = await deleteBook(req.params.id);

  if (!deleted) {
    res.status(404).send("Book not found.");
    return;
  }

  res.redirect("/");
});

app.post("/add", async (req, res) => {
  const result = await addBook(req.body);

  if (result.added) {
    res.redirect("/add?success=1");
    return;
  }

  res.status(500).render("addBook.ejs", { error: result.message });
});

app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`);
});
