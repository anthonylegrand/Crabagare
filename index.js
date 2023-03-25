require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();

require("./database/");

require("./Commands/")(client);
require("./Events/")(client);

require("./express/server");

client.login(process.env.BOT_TOKEN);
