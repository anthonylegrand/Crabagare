const { SlashCommandBuilder } = require("discord.js");
const DATABASE = require("../../database");
const { Utilisateurs, Villages } = DATABASE.models;
const { EmbedUtils, EMBED_COLOR } = require("../../embedsUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profil")
    .setDescription("Afficher mes informations")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("Afficher les informations d'un autre utilisateur")
    ),
  async execute(interaction) {
    const OPTION_USER = interaction.options.getUser("utilisateur");
    const PROFIL = await getUtilisateur(interaction.user.id, OPTION_USER?.id);

    const embed = new EmbedUtils({
      interaction,
      profilThumbnail: true,
    }).setDescription("\u200B");

    if (PROFIL) {
      embed
        .setColor(EMBED_COLOR.GREEN)
        .setTitle("🚀 Profile de %username%")
        .addFields(
          {
            Pinces: "🦀 **" + PROFIL.pinces.toString() + "**",
            Villages: "🏛️ **" + PROFIL.villagesCount.toString() + "**",
          },
          [0, 1]
        );
    } else {
      embed
        .setColor(EMBED_COLOR.RED)
        .setTitle("🚨 %username%")
        .setDescription(
          `Oups, %username% ${
            OPTION_USER ? "" : " tu"
          } ne joue pas pour le moment !\n${
            OPTION_USER ? "Il " : "Tu"
          } peux commencer à jouer en utilisant la commande **/village**`
        );
    }

    interaction.reply({ embeds: [embed.getEmbed()] });
  },
};

async function getUtilisateur(User_ID, OPTION_USER) {
  return Utilisateurs.findByPk(OPTION_USER || User_ID, {
    attributes: {
      include: [
        [DATABASE.fn("COUNT", DATABASE.col("Villages.id")), "villagesCount"],
      ],
    },
    include: [
      {
        model: Villages,
        attributes: [],
      },
    ],
    group: ["Utilisateurs.Discord_id", "Villages.id"],
    raw: true,
  });
}
