const express = require("express");
const {
  logWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
} = require("../controllers/workout.controller");
const router = express.Router();

router.post("/", logWorkout);
router.get("/", getWorkouts);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

module.exports = router;
