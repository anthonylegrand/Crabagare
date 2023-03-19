const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const DATABASE = require("../../database");
const { Villages } = DATABASE.models;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("village_nom")
    .setDescription("Modifier le nom du village")
    .addStringOption((option) =>
      option
        .setName("nouveau_nom")
        .setDescription("Nouveau nom du village")
        .setRequired(true)
    ),
  async execute(interaction) {
    const GUILD_ID = interaction.guild.id;
    const NEW_NAME = interaction.options.getString("nouveau_nom");

    let result = await Villages.update(
      {
        nom: NEW_NAME,
      },
      {
        where: {
          UtilisateurDiscordId: interaction.user.id,
          discord_serveur_id: GUILD_ID,
        },
        limit: 1,
      }
    );

    const embed = new EmbedBuilder()
      .setThumbnail(interaction.user.avatarURL())
      .setDescription("\u200B")
      .setTimestamp();

    if (result[0])
      embed
        .setColor("#27ae60")
        .setTitle("✅ Village de " + interaction.user.username)
        .setDescription(
          `Le village vient d'être renomé: \n 🔨 **${NEW_NAME}**`
        );
    else
      embed
        .setColor("#c0392b")
        .setTitle("🚨  " + interaction.user.username)
        .setDescription(`Impossible de modifier le nom de ton village`);

    interaction.reply({ embeds: [embed] });
  },
};
