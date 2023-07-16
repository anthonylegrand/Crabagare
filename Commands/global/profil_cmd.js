const { SlashCommandBuilder } = require("discord.js");
const sequelize = require("../../database");
const DATABASE = require("../../database");
const { Utilisateurs, Crabes } = DATABASE.models;

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
    const PROFIL =
      (await getUser(OPTION_USER, interaction)) ||
      (await createUser(interaction));
    console.log(OPTION_USER, PROFIL, interaction.user);

    interaction.reply(JSON.stringify(PROFIL));
  },
};

async function getUser(OPTION_USER, interaction) {
  return Utilisateurs.findByPk(OPTION_USER?.id || interaction.user.id, {
    attributes: {
      include: [
        [DATABASE.fn("COUNT", DATABASE.col("Crabes.id")), "CrabesCount"],
      ],
    },
    include: [
      {
        model: Crabes,
        attributes: [],
      },
    ],
    group: ["Utilisateurs.Discord_id", "Crabes.id"],
    raw: true,
  });
}

async function createUser(interaction) {
  return Utilisateurs.create({
    Discord_id: interaction.user.id,
    Username: interaction.user.username,
  });
}
