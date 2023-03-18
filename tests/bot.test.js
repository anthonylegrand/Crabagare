require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Events,
  ChannelType,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag} for testing !`);

  const TEST_USER = await client.users.fetch(process.env.TEST_USER);
  if (!TEST_USER) return console.log(`Invalid Test User Id`);

  global.TEST_CHANNEL = await createTestChannel();
  if (!global.TEST_CHANNEL) return console.log(`Test channel can't be cerate`);
  global.TEST_CHANNEL.send(`${TEST_USER} Les tests vont commencer`);

  require("./sections/Commandes.test")();
});

client.login(process.env.TEST_BOT_TOKEN);

function createTestChannel() {
  return client.guilds.cache.get(process.env.TEST_GUILD).channels.create({
    name: new Date()
      .toLocaleString()
      .split("/")
      .join("-")
      .split(", ")
      .join("_")
      .split(":")
      .join("-")
      .toString(),
    type: ChannelType.GuildText,
    parent: process.env.TEST_CATEGORIE,
  });
}
