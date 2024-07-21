const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const adminLayout = "../views/layouts/admin";

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (token, refreshToken, profile, done) => {
      try {
        // let user = await User.findOne({ googleID: profile.id });
        // if (!user) {
        //   user = new User({
        //     googleID: profile.id,
        //     name: profile.displayName,
        //   });
        //   await user.save();
        // }
        // console.log(profile);
        let user = await User.findOne({ googleID: profile.id });
        if (!user) {
          return done(null, false, { message: "access denied" });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
router.use(passport.initialize());
router.use(passport.session());

//get admin login page
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "admin",
      description: "Simeple Blogs",
    };
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (err) {
    console.log(err);
  }
});
//google
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect;

    res.redirect("/admin/posting");
  }
);

router.get("/admin/posting", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("SUCCESS");
  } else {
    res.redirect("/");
  }
});

module.exports = router;

// //post admin check login
// router.post("/admin", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (req.body.username === "admin" && req.body.password === "password") {
//       res.send("You are Logged IN");
//     } else {
//       res.send("wrong username or password");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

// //post admin register
// router.post("/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (req.body.username === "admin" && req.body.password === "password") {
//       res.send("You are Logged IN");
//     } else {
//       res.send("wrong username or password");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });
