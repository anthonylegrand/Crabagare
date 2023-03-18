const { EmbedBuilder } = require("discord.js");

async function Section(title, tests) {
  console.log(`New Section "${title}"`);
  createEmbed(title, `Execution de ${tests.length} tests`, true);

  for await (let test of tests) {
    client.commands.get(interaction.commandName);
    global.TEST_CHANNEL.send(await test.execute());
  }
}

class Test {
  constructor(title) {
    this.title = title;
  }

  runCommand(command) {
    this.command = command;
    return this;
  }

  whantAnswer() {
    return this;
  }

  async execute() {
    return await new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.command), 5234);
    });
  }
}

function createEmbed(title, message, valid = true) {
  const embed = new EmbedBuilder()
    .setColor(valid ? "#2ecc71" : "#e74c3c")
    .setTitle(title)
    .setDescription(message)
    .setTimestamp();

  global.TEST_CHANNEL.send({ embeds: [embed] });
}

module.exports = { Section, Test };
