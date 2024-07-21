require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDb = require("./server/config/db");
const app = express();
const port = 3000;
const path = require("path");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayout);
app.set("layout", "./layouts/main");
//connect DB
connectDb();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    // store: MongoStore.create({
    //   mongoUrl: process.env.CONNECTION,
    // }),
  })
);

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
