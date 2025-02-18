const express = require("express");
const { signup, login, users } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", users);

module.exports = router;
