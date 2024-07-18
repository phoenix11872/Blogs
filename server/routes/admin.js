const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

const adminLayout = "../views/layouts/admin";
//get admin login page
router.get("/admin", async (req, res) => {
  const locals = {
    title: "admin",
    description: "Simeple Blogs",
  };
  res.render("admin/index", { locals, layout: adminLayout });
});
//post admin check login

router.post("/admin", async (req, res) => {
  const { username, password } = req.body;
  if (req.body.username === "admin" && req.body.password === "password") {
    res.send("You are Logged IN");
  } else {
    res.send("wrong username or password");
  }
});

module.exports = router;
