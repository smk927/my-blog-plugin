const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Atlas Connection
const uri = "mongodb+srv://admin:don5555@cluster0.8cuft.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Schema and Model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  imageUrl: String,
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

// Hardcoded admin credentials (for simplicity)
const adminCredentials = {
  username: "admin",
  password: "admin123",
};

// Admin Login
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username === adminCredentials.username &&
    password === adminCredentials.password
  ) {
    res.json({ success: true, token: "admin-token" }); // Simple token
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Get all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single post by ID
app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new post
app.post("/posts", async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    const post = new Post({ title, content, imageUrl });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a post
app.put("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, imageUrl } = req.body;
    const post = await Post.findByIdAndUpdate(
      id,
      { title, content, imageUrl },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a post
app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like a post
app.put("/posts/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
