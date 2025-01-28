const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, password, username });
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send("Error registering user: " + error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid email or password.");
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Login successful!",
      userId: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(400).send("Error logging in: " + error.message);
  }
};

const users = async (req, res) => {
  try {
    const users = await User.find({});
    const usernames = users.map((user) => user.id);
    res.status(200).json(usernames);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { signup, login, users };
