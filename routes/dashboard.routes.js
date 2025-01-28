const express = require(`express`);
const { dashboard } = require("../controllers/dashboard.controller");
const router = express.Router();

router.get("/:userId", dashboard);

module.exports = router;
