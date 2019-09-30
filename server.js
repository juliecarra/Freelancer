const express = require("express");
const connectingDB = require("./config/db_connection");
const { check, validationResult } = require("express-validator/check"); //Handle validation
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const app = express();

//Connect Databse
connectingDB();

//Init Middleware
app.use(express.json({ extended: false })); //Get datas from req.body

app.use(cors("http://localhost:3000"));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));

app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 1995;

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
