const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  goalType: { type: String, required: true },
  targetValue: { type: Number, required: true },
  currentValue: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now, required: true },
  endDate: { type: Date, required: true },
});

module.exports = mongoose.model("Goal", goalSchema);
