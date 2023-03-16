const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crabe")
    .setDescription("Que la puissance des crabes soit avec toi !"),
  async execute(interaction) {
    await interaction.reply(
      `Ce serveur est "${interaction.guild.name}" et a ${interaction.guild.memberCount} crabes.`
    );
  },
};
