const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator/check");
const config = require("config");
const express = require("express");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../../models/User");

// //@route   POST api/users
// //@desc    Register user
// //@access  Public
router.post(
  "/register",
  [
    check("name", "Name is required") //Check if name is here
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(), //Check if email is here
    check(
      "password", //Check if password is more than  6 characters
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    // console.log("ici...");
    // return res.json({ msg: "todo work it" });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //If we have errors then, we send a bad request
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body; //Destructuring to get the datas

    try {
      //See if user exists
      let user = await User.findOne({ email });

      if (user) {
        res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }
      //Get users gravatar (link an image to the email)
      const avatar = gravatar.url(email, {
        s: "200", //Default size of image
        r: "pg",
        d: "mm" //Give a default image
      });

      //Create an instance of user
      user = new User({
        name,
        email,
        avatar,
        password
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //Return jsonwebtoken (enable user to access or not protected routes)
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

// router.post("/login", (req, res) => {
//   res.send("okben c'est ça :/");
// });

//@route   POST api/users
//@desc     user
//@access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(), //Check if email is here
    check(
      "password", //Check if password is more than  6 characters
      "Password is required"
    ).exists()
  ],
  async (req, res) => {
    // console.log("ici...");
    // return res.json({ msg: "todo work it" });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //If we have errors then, we send a bad request
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body; //Destructuring to get the datas

    try {
      //See if user exists
      let user = await User.findOne({ email });

      if (!user) {
        res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password); //We check if the password of the user is a match and if it is not a match then, we send back an error message
      if (!isMatch) {
        res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //Return jsonwebtoken (enable user to access or not protected routes)
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
