// server12.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

mongoose.connect("mongodb+srv://jhansirambha:J05%407@collegetalenthub.47hm9a4.mongodb.net/student");

const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  password: String
}));

const app = express();
app.use(express.json());
const SECRET = "mysecret";

// Login
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User not found");
  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).send("Invalid password");
  const token = jwt.sign({ id: user._id }, SECRET);
  res.json({ token });
});

// Protected
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token");
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
}
app.get("/protected", auth, (req, res) => res.send("Protected Data"));

app.listen(3000, () => console.log("Auth API running..."));
