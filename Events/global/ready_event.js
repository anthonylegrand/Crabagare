const { Events } = require("discord.js");

module.exports = (client) => {
  client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
  });
};
