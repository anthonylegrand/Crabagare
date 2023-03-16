const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  ["global"].map((folder) => {
    // Generate All Events folders path
    const eventsPath = path.join(__dirname, folder);
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js"));

    // Get all commandes paths on folders
    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      try {
        require(filePath)(client);
      } catch (error) {
        console.error(
          `Une erreur est survenue dans le fichier Event "${filePath}"`
        );
        console.error(error);
      }
    }
  });
};
