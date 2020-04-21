if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const userRouter = require("./routes/user");
const mainRouter = require("./routes/main");

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
  res.status(200).json({ msg: "dustedddd" });
});

app.use("/user", userRouter);
app.use("/", mainRouter);

app.listen(process.env.PORT || 3000);
