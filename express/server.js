require("dotenv").config();
const express = require("express"),
  app = express(),
  fs = require("fs");

const DATABASE = require("./../database/");
const { Pictures } = DATABASE.models;

app.get("/picture/:id", function (req, res) {
  res.set("Content-Type", "image/png");
  res.sendFile(__dirname + "/public/" + req.params.id);
});

app.listen(80, () => {
  console.log(`Express server is running on port ${8080}.`);
  setTimeout(() => registerAllPictures(), 10_000); // Attendre 10 sec que la BDD soit connecté
});

function registerAllPictures() {
  const PATH = "./express/" + process.env.PICTURES_PATH_FOLDER + "/";
  fs.readdir(PATH, (err, files) => {
    files.forEach(async (file) => {
      let result = null;
      if (file.split(".")[0].length === 7)
        result = await Pictures.findOne({
          attributes: ["id"],
          where: {
            nom: file.split(".")[0],
          },
          raw: true,
        });

      if (!result) {
        let rand_id = Math.random().toString(16).substr(2, 7);
        fs.renameSync(PATH + file, PATH + rand_id + ".png");
        Pictures.create({
          nom: rand_id,
        });
      }
    });
  });
}
