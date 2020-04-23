if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const expressLayouts = require("express-ejs-layouts");

app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use("/uploads", express.static("uploads"));
app.use(expressLayouts);

const userRouter = require("./routes/user");
const mainRouter = require("./routes/main");
const adminRouter = require("./routes/admin");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = process.env.DATABASE_URL;
// console.log(uri);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.get("/", (req, res) => {
  res.render("adminlogin");
});

app.use("/user", userRouter);
app.use("/", mainRouter);
app.use("/admin", adminRouter);

app.listen(process.env.PORT || 3000);
