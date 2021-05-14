const express = require("express");
const router = express.Router();
const auth = require("./../../middleware/auth");
const Profile = require("./../../models/Profile");
const User = require("./../../models/User");

//@route GET api/profile/me
//@desc    Get current user api
//@access Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["avatar", "name"]
    );
    if (!profile) {
      return res
        .status(400)
        .json({ mag: " There is no profile for this user " });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
