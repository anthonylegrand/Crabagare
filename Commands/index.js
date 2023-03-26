const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  let commands = [];
  ["global", "village", "crabe"].map((folder) => {
    // Generate All CMD folders path
    const commandsPath = path.join(__dirname, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

    // Get all commands paths on folders
    for (const file of commandFiles) {
      if (!file.includes("_cmd")) continue;
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
      } else
        console.log(
          `[ATTENTION] Il manque à la commande ${filePath} une propriété "data" ou "execute" requise.`
        );
    }
  });

  if (process.argv.includes("--deploy-commands"))
    require("./../scripts/deploy-commands")(commands);
};
