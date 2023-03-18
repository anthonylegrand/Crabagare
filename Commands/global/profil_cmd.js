const { SlashCommandBuilder } = require("discord.js");
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
    const PROFIL = await getUtilisateur();

    if (PROFIL) {
      interaction.reply(
        `Profil de ${
          OPTION_USER?.tag || interaction.user
        }, il a ${JSON.stringify(PROFIL)}`
      );
    } else {
      interaction.reply(
        `Oups, ${OPTION_USER?.tag || interaction.user} ${
          OPTION_USER ? "" : " tu"
        } ne joue pas pour le moment !\n${
          OPTION_USER ? "Il " : "Tu"
        } peux commencer à jouer en utilisant la commande **/village**`
      );
    }
  },
};

async function getUtilisateur() {
  return Utilisateurs.findByPk(OPTION_USER?.id || interaction.user.id, {
    attributes: {
      include: [
        [DATABASE.fn("COUNT", DATABASE.col("Villages.id")), "VillagesCount"],
      ],
    },
    include: [
      {
        model: Villages,
        attributes: [],
      },
    ],
    group: ["Utilisateurs.Discord_id", "Villages.id"],
  });
}
