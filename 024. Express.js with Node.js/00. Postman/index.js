import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("<h1> Home Page </h1>");
});

app.post("/register", (req, res) => {
  res.sendStatus(201);
});

app.put("/user/shiba", (req, res) => {
  res.sendStatus(200);
});

app.delete("/user/shiba", (req, res) => {
  res.sendStatus(200);
});

app.patch("/user/shiba", (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Starting server on ${PORT}`);
});
