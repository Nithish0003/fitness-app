const express = require(`express`);
const bodyParser = require(`body-parser`);
const mongoose = require(`mongoose`);
const User = require("./models/user.model");
const path = require("path");
const Workout = require("./models/workout.model");
const Goal = require("./models/goals.model");
const app = express();

// app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello form node-api");
});

// static files
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    const usernames = users.map((user) => user.id);
    res.status(200).json(usernames);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, password, username });
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send("Error registering user: " + error.message);
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).send("Invalid email or password.");
    }
    res.status(200).json({
      message: "Login successful!",
      userId: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(400).send("Error logging in: " + error.message);
  }
});

// Log a new workout
app.post("/api/workouts", async (req, res) => {
  try {
    const newWorkout = new Workout(req.body);
    await newWorkout.save();
    res.status(201).send(newWorkout);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Retrieve workout history
app.get("/api/workouts", async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.query.userId });
    res.status(200).send(workouts);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update a specific workout
app.put("/api/workouts/:id", async (req, res) => {
  try {
    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).send(updatedWorkout);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a specific workout
app.delete("/api/workouts/:id", async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Workout deleted" });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all goals for a specific user
app.get("/api/goals", async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.query.userId });
    res.status(200).json(goals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create a goal for a user
app.post("/api/goals", async (req, res) => {
  try {
    const { userId, goalType, targetValue, currentValue, startDate, endDate } =
      req.body;
    const goal = new Goal({
      userId,
      goalType,
      targetValue,
      currentValue,
      startDate,
      endDate,
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a specific goal by ID
app.put("/api/goals/:id", async (req, res) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedGoal) {
      return res.status(404).json({ message: "Goal not found." });
    }
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a specific goal by ID
app.delete("/api/goals/:id", async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found." });
    }
    res.status(200).json({ message: "Goal deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/dashboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const workouts = await Workout.find({ userId });
    const goals = await Goal.find({ userId });
    res.status(200).json({ workouts, goals });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching dashboard data", error: error.message });
  }
});

mongoose
  .connect(
    "mongodb+srv://nits000333:0KFToxEeJeYQToT4@backenddb.muafh.mongodb.net/Node-API?retryWrites=true&w=majority&appName=backendDB"
  )
  .then(() => {
    console.log("Connected to database...");
    app.listen(3000, () => {
      console.log("server is running on port 3000....");
    });
  })
  .catch(() => {
    console.log("Connection failed!!!");
  });
