import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config("../../.env");

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "secrets",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const result = await db.query(
    "INSERT INTO users (email, password) VALUES ($1, $2)",
    [req.body.username, req.body.password],
  );

  if (result.rowCount > 0) {
    console.log("Succesfully registered user");
    res.render("secrets.ejs");
  } else {
    res.redirect("/");
  }
});

app.post("/login", async (req, res) => {
  const result = await db.query(
    "SELECT * FROM users WHERE email=$1 AND password=$2",
    [req.body.username, req.body.password],
  );

  if (result.rowCount > 0) {
    console.log(result.rows[0]);
    console.log("User succefullly logged in.");
    res.render("secrets.ejs");
  } else {
    console.log("Error logging in.");
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
