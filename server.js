const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

app.use(cors());
app.use(express.json());

// -----------------------------------------
// ✅ MONGO DB CONNECTION
// -----------------------------------------
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/budgetbuddy", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// -----------------------------------------
// USER MODEL
// -----------------------------------------
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  designation: String,
  company: String,
  location: String,
  bio: String,
});

const User = model("User", UserSchema);


// -----------------------------------------
// SIGNUP
// -----------------------------------------
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, designation, company, location, bio } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      designation,
      company,
      location,
      bio,
    });

    await newUser.save();

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Error signing up", error: err });
  }
});


// -----------------------------------------
// LOGIN
// -----------------------------------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in", error: err });
  }
});


// -----------------------------------------
// MIDDLEWARE
// -----------------------------------------
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


// -----------------------------------------
// PROFILE
// -----------------------------------------
app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Error fetching profile", error: err });
  }
});

// UPDATE PROFILE
app.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, designation, company, location, bio } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (designation) user.designation = designation;
    if (company) user.company = company;
    if (location) user.location = location;
    if (bio) user.bio = bio;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Error updating profile", error: err });
  }
});


// -----------------------------------------
// EXPENSE MODEL
// -----------------------------------------
const ExpenseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  monthlySalary: Number,
  category: String,
  amount: Number,
  date: Date,
  paymentMethod: String,
  notes: String,
});

const Expense = model("Expense", ExpenseSchema);


// -----------------------------------------
// GET EXPENSES
// -----------------------------------------
app.get("/expenses", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({
      date: -1,
    });

    res.json(expenses);
  } catch (err) {
    console.error("Fetch expenses error:", err);
    res.status(500).json({ message: "Error fetching expenses", error: err });
  }
});


// -----------------------------------------
// ADD EXPENSE
// -----------------------------------------
app.post("/expenses", authMiddleware, async (req, res) => {
  try {
    const { monthlySalary, category, amount, date, paymentMethod, notes } =
      req.body;

    const expense = new Expense({
      userId: req.userId,
      monthlySalary,
      category,
      amount,
      date,
      paymentMethod,
      notes,
    });

    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error("Save expense error:", err);
    res.status(500).json({ message: "Error saving expense", error: err });
  }
});


// -----------------------------------------
// DELETE EXPENSE
// -----------------------------------------
app.delete("/expenses/:id", authMiddleware, async (req, res) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findById(expenseId);
    
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Verify expense belongs to authenticated user
    if (expense.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized: Cannot delete this expense" });
    }

    await Expense.findByIdAndDelete(expenseId);
    res.json({ message: "Expense deleted successfully", expense });
  } catch (err) {
    console.error("Delete expense error:", err);
    res.status(500).json({ message: "Error deleting expense", error: err.message });
  }
});


// -----------------------------------------
// ML PREDICTION
// -----------------------------------------
app.post("/predict", async (req, res) => {
  try {
    const response = await axios.post("http://127.0.0.1:5001/predict", req.body);
    res.json(response.data);
  } catch (err) {
    console.error("Error calling Python API:", err.message);
    res.status(500).json({ message: "Prediction failed", error: err.message });
  }
});

// -----------------------------------------
// HEALTH CHECK
// -----------------------------------------
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// -----------------------------------------
// SERVER START
// -----------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
