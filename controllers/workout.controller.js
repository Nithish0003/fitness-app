const Workout = require("../models/workout.model");

const logWorkout = async (req, res) => {
  try {
    const newWorkout = new Workout(req.body);
    await newWorkout.save();
    res.status(201).send(newWorkout);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.query.userId });
    res.status(200).send(workouts);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateWorkout = async (req, res) => {
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
};

const deleteWorkout = async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Workout deleted" });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { logWorkout, getWorkouts, updateWorkout, deleteWorkout };
