const express = require(`express`);
const { dashboard } = require("../controllers/dashboard.controller");
const authToken = require("../middleware/authToken");
const router = express.Router();

router.get("/:userId", authToken, dashboard);

module.exports = router;
