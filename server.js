
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const USERS_FILE = "users.json";

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]");
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body;
  const users = readUsers();

  if (users.find((user) => user.email === email)) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const newUser = { name, email, password, score: 0, category: "N/A" };
  users.push(newUser);
  saveUsers(users);

  res.json({ message: "Signup successful", user: newUser });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({ message: "Login successful", user });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
