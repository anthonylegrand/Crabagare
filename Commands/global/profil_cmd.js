const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const DATABASE = require("../../database");
const { Utilisateurs, Villages } = DATABASE.models;

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

    const embed = new EmbedBuilder()
      .setThumbnail((OPTION_USER || interaction.user).avatarURL())
      .setDescription("\u200B")
      .setTimestamp();

    if (PROFIL) {
      embed
        .setColor("#27ae60")
        .setTitle(
          "🚀  Profile de " +
            (OPTION_USER?.username || interaction.user.username)
        )
        .addFields(
          {
            name: "Pinces :",
            value: "🦀 **" + PROFIL.pinces.toString() + "**",
          },
          {
            name: "Villages :",
            value: "🏛️ **" + PROFIL.villagesCount.toString() + "**",
          }
        );
    } else {
      embed
        .setColor("#c0392b")
        .setTitle("🚨  " + (OPTION_USER?.username || interaction.user.username))
        .setDescription(
          `Oups, ${OPTION_USER?.tag || interaction.user} ${
            OPTION_USER ? "" : " tu"
          } ne joue pas pour le moment !\n${
            OPTION_USER ? "Il " : "Tu"
          } peux commencer à jouer en utilisant la commande **/village**`
        );
    }

    if (OPTION_USER)
      embed.setFooter({
        text: "Profil demandé par " + interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      });

    interaction.reply({ embeds: [embed] });
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
