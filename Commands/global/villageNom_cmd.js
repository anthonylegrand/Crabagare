const { SlashCommandBuilder } = require("discord.js");
const DATABASE = require("../../database");
const { Villages } = DATABASE.models;
const { EmbedUtils, EMBED_COLOR } = require("../../embedsUtils");

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

    const result = await updateVillageName(
      NEW_NAME,
      interaction.user.id,
      GUILD_ID
    );

    const embed = new EmbedUtils({
      interaction,
      profilThumbnail: true,
    }).setDescription("\u200B");

    if (result[0])
      embed
        .setColor(EMBED_COLOR.GREEN)
        .setTitle("✅ Village de %username%")
        .setDescription(
          `Le village vient d'être renomé: \n 🔨 **${NEW_NAME}**`
        );
    else
      embed
        .setColor(EMBED_COLOR.RED)
        .setTitle("🚨  %username%")
        .setDescription(`Impossible de modifier le nom de ton village`);

    interaction.reply({ embeds: [embed.getEmbed()] });
  },
};

async function updateVillageName(NEW_NAME, USER_ID, GUILD_ID) {
  return Villages.update(
    {
      nom: NEW_NAME,
    },
    {
      where: {
        UtilisateurDiscordId: USER_ID,
        discord_serveur_id: GUILD_ID,
      },
      limit: 1,
    }
  );
}
