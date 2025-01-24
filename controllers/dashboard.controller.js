const Workout = require("../models/workout.model");
const Goal = require("../models/goals.model");

const dashboard = async (req, res) => {
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
};

module.exports = { dashboard };
