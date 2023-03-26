const { SlashCommandBuilder } = require("discord.js");
const sequelize = require("sequelize");
const DATABASE = require("../../database");
const { Crabes } = DATABASE.models;

const { EmbedUtils, EMBED_COLOR, embedError } = require("../../embedsUtils");
const { getCrabeEmbed, getFindOptions } = require("./crabe_utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crabe")
    .setDescription("Afficher un crabes de mon village")
    .addStringOption((option) =>
      option
        .setName("nom")
        .setDescription("Nom du crabe à rechercher")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const nom = interaction.options.getString("nom");
      const DATA = {
        nom,
        DISCORD_ID: interaction.guild.id,
        USER_ID: interaction.user.id,
      };

      const CRABE = await fetchCrabes(DATA);
      if (!CRABE)
        return interaction.reply({
          embeds: [noCrabeEmbed(interaction).getEmbed()],
        });
      const embed = getCrabeEmbed(CRABE, interaction)
        .setFooter(`Appartient à %username%`, interaction.user.avatarURL())
        .setColor(EMBED_COLOR.GREEN);

      interaction.reply({ embeds: [embed.getEmbed()] });
    } catch (error) {
      return interaction.reply({
        embeds: [
          embedError(error, "/crabe {?nom}", interaction.guild.id).getEmbed(),
        ],
      });
    }
  },
};

async function fetchCrabes(DATA) {
  const where = { nom: { [sequelize.Op.iLike]: "%" + DATA.nom + "%" } };

  return Crabes.findOne({
    ...getFindOptions(where, DATA),
    raw: true,
  });
}

function noCrabeEmbed(interaction) {
  return new EmbedUtils({
    interaction,
    title: "🚨 Crabe de %username%",
    color: EMBED_COLOR.RED,
    profilThumbnail: true,
  }).setDescription(
    `Tu n'as pas de crabe dans ton village qui contien '**${interaction.options.getString(
      "nom"
    )}**' dans son nom`
  );
}
