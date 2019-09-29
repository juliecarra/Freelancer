const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator/check");
const config = require("config");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../../models/User");

//@route   GET api/auth
//@desc    Authenticate route
//@access  Public

//Will get the user datas except the password
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   POST api/auth
//@desc    Authenticate user
//@access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(), //Check if email is here
    check("password", "Password is required").exists() //Check if password is here
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //If we have errors then, we send a bad request
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body; //Destructuring to get the datas

    try {
      //See if user exists by his email
      let user = await User.findOne({ email });

      if (!user) {
        //If there is not a user then we send "Invalid Credentials"
        res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password); //We check if the password of the user is a match and if it is not a match then, we send back an error message

      if (!isMatch) {
        res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
