const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(express.json()); // for parsing application/json

// Mock users data (Replace this with MongoDB later)
const users = [];

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const repoSchema = new mongoose.Schema({
  name: String,
  owner: String,
  visibility: String,
  tags: [String],
});

const Repository = mongoose.model("Repository", repoSchema);

const User = mongoose.model("User", userSchema);

app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(user.toJSON(), "your_jwt_secret");
      res.json({ accessToken });
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

app.post("/create-repo", async (req, res) => {
  try {
    const repo = new Repository(req.body);
    await repo.save();
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.get("/list-repos", async (req, res) => {
  try {
    const repos = await Repository.find();
    res.json(repos);
  } catch {
    res.status(500).send();
  }
});

app.post("/add-tag", async (req, res) => {
  try {
    // Step 1: Extract data from the request body
    const { repoName, tag } = req.body;

    // Step 2: Find the repository by its name
    const repo = await Repository.findOne({ name: repoName });

    // If the repository is not found, send a 404 status
    if (!repo) {
      return res.status(404).send("Repository not found");
    }

    // Step 3: Add the new tag to the tags array
    repo.tags.push(tag);

    // Step 4: Save the updated repository document
    await repo.save();

    // Step 5: Send a success response
    res.status(201).send("Tag added successfully");
  } catch (error) {
    // Log the error and send a 500 status code
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
