const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const adminLayout = "../views/layouts/admin";

//setting up passport for goole auth
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
//google auth
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  })
);
//redirects after logging through google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect;

    res.redirect("/dashboard");
  }
);
//middleware to logout
const logoutMiddleWare = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
    next();
  });
};
//middleWare to check if user logged in or not
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ mesage: "Unauthorized" });
  }
};
//for logging out
router.get("/logout", logoutMiddleWare);

/**
 * GET- Admin Dashoboard
 */

router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    const data = await Post.find();
    const locals = {
      title: "admin",
      description: "Simeple Blogs",
    };
    res.render("admin/dashboard", { locals, data, layout: adminLayout });
  } catch (err) {
    console.log(err);
  }
});

/**
 * GET/Admin create new posts
 */

router.get("/add-post", isLoggedIn, async (req, res) => {
  try {
    const data = await Post.find();
    const locals = {
      title: "add Post",
      description: "Simeple Blogs",
    };
    res.render("admin/add-post", { locals, data, layout: adminLayout });
  } catch (err) {
    console.log(err);
  }
});

/**
 * Post/Admin create new posts
 */

router.post("/add-post", isLoggedIn, async (req, res) => {
  try {
    res.redirect("/dashboard");
    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
    });
    await Post.create(newPost);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

/**
 * get /Admin Edit Post
 */

router.get("/edit-post/:id", isLoggedIn, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Simeple Blogs",
    };
    const data = await Post.findOne({ _id: req.params.id });
    res.render("admin/edit-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (err) {
    console.log(err);
  }
});

/**
 * Put /Admin Edit Post
 */

router.put("/edit-post/:id", isLoggedIn, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      UpdatedAt: Date.now(),
    });
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

/**
 * delete /Admin delete Post
 */

router.delete("/delete-post/:id", isLoggedIn, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
