const express = require("express");
const router = express.Router();
const auth = require("./../../middleware/auth");
const Profile = require("./../../models/Profile");
const User = require("./../../models/User");
const { check, validationResult } = require("express-validator");

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

//@route POST api/profile/
//@desc    Update or create a profile
//@access Private

router.post(
  "/",
  [
    auth,
    check("status", "status is required").not().isEmpty(),
    check("skills", "skills is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      // spread the rest of the fields we don't need to check
      ...rest
    } = req.body;

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (website) profileFields.website = website;
    if (status) profileFields.status = status;
    if (company) profileFields.company = company;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (location) profileFields.location = location;
    if (skills)
      profileFields.skills = skills.split(",").map((skill) => skill.trim());

    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      // create
      profile = new Profile(profileFields);

      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).json("Server Error");
    }
  }
);

//@route get api/profile/
//@desc  get all prpfiles
//@access public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
});

//@route get api/profile/user/:user_id
//@desc  get  prpfile by user ID
//@access public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    if (err.kind == "ObjectId") {
      return res.status(500).json("profile not found");
    }
    res.status(500).json("Server Error");
  }
});

//@route delete  api/profile/
//@desc  delete profile/user and post
//@access private

router.delete("/", auth, async (req, res) => {
  try {
    //todo: remove user posts

    //remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ mag: "user deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
});

//@route PUT api/profile/experience
//@desc  add priofle expeirence
//@access private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "company is required").not().isEmpty(),
      check("from", "from is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, desciption } =
      req.body;

    const newExp = { title, company, location, from, to, current, desciption };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).json("Server Error");
    }
  }
);

module.exports = router;
