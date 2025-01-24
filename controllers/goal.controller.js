const Goal = require("../models/goals.model");

const createGoal = async (req, res) => {
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
};

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.query.userId });
    res.status(200).json(goals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateGoal = async (req, res) => {
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
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found." });
    }
    res.status(200).json({ message: "Goal deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createGoal, getGoals, updateGoal, deleteGoal };
