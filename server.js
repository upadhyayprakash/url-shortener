const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/ShortUrl");
const port = process.env.PORT || 5001;
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/urlshortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.get("/", async (req, res) => {
  const urls = await ShortUrl.find({deleted: false}).sort({ clicks: "desc" });
  let result = [];
  urls.forEach((doc) =>
    result.push({
      id: doc.id,
      full: doc.full,
      shortCode: doc.short,
      redirectUrl: `${req.protocol}://${req.get("host")}/${doc.short}`,
      clicks: doc.clicks,
    })
  );
  res.render("index", { urls: result });
  //   res.json({ message: "Welcome to Titly URL Shortener", urls: result });
});

app.post("/shorten", async (req, res) => {
  try {
    const doc = await ShortUrl.create({ full: req.body.fullUrl });

    res.status(201).json({
      message: "Success!",
      data: {
        shortUrl: `${req.protocol}://${req.get("host")}/${doc.short}`,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl, deleted: false });
  if (!shortUrl) {
    return res.sendStatus(404);
  }
  shortUrl.clicks++;
  shortUrl.save();
  console.log(`Redirecting to: ${shortUrl.full}`);
  res.redirect(shortUrl.full);
});

app.delete("/:shortUrl", async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl, deleted: false });
    if(!shortUrl) {
        return res.sendStatus(404);
    }
    shortUrl.deleted = true;
    shortUrl.save();
    console.log(`Deleted: ${shortUrl.short}`);
    res.status(200).json({message: `Short Url: ${shortUrl.short} deleted!`})
})

const listener = app.listen(port);
