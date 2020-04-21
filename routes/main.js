const express = require("express");
const router = express.Router();

const Contact = require("../models/contacts");
const News = require("../models/news");

router.get("/prod", (req, res, next) => {
  res.status(200).json({ msg: "dussted" });
});

router.post("/contact", (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const message = req.body.message;
  const newContact = new Contact({
    username,
    email,
    message,
  });

  newContact
    .save()
    .then(() => res.json("Updated Your Response"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/news", (req, res, next) => {
  const newsHeader = req.body.newsHeader;
  const imageSrc = req.body.imageSrc;
  const description = req.body.description;
  const type = req.body.type;

  const newNews = new News({
    newsHeader,
    imageSrc,
    description,
    type,
  });

  newNews
    .save()
    .then(() => res.json("Updated Your Response"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/news", (req, res) => {
  News.find()
    .then((news) => res.json(news))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
