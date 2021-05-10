const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "please include valid email adress").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or mrore charechters"
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send("users route");
  }
);

module.exports = router;
