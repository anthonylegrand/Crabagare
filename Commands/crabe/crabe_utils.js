const sequelize = require("sequelize");
const DATABASE = require("../../database");
const { Villages, Travaille_Types, Pictures } = DATABASE.models;

const { EmbedUtils, EMBED_COLOR } = require("../../embedsUtils");

function getCrabeEmbed(CRABE, interaction) {
  return new EmbedUtils({
    interaction,
    title: `🦀 ${CRABE.nom}`,
    color: EMBED_COLOR.PURPLE,
    profilThumbnail: false,
  })
    .setImage(process.env.PICTURES_PREFIX_URL + CRABE["Picture.nom"] + ".png")
    .addFields(
      {
        Niveau: "🍼 " + CRABE.niveau.toString(),
        Vie: "💖 " + CRABE.vie.toString() + "/100",
        ["\u200B"]: "\u200B",
      },
      [0, 1, 2]
    )
    .addFields(
      {
        Pince: "🗡️ " + CRABE.niveau_pinces.toString(),
        Carapace: "🛡️ " + CRABE.niveau_carapace.toString(),
        Travaille: "🏛️ " + CRABE["Travaille_Type.type"].toString(),
      },
      [0, 1, 2]
    );
}

function getFindOptions(where = {}, DATA) {
  const SQL = createSubRequestVillage(DATA);
  return {
    where: {
      VillageId: [sequelize.literal(SQL.replace(";", ""))],
      ...where,
    },
    attributes: [
      "id",
      "vie",
      "nom",
      "niveau",
      "niveau_pinces",
      "niveau_carapace",
    ],
    include: [
      {
        model: Travaille_Types,
        attributes: ["type"],
      },
      Pictures,
    ],
  };
}

function createSubRequestVillage({ DISCORD_ID, USER_ID }) {
  return Villages.queryGenerator.selectQuery(
    Villages.getTableName(),
    {
      where: {
        discord_serveur_id: DISCORD_ID,
        UtilisateurDiscordId: USER_ID,
      },
      attributes: ["id"],
    },
    Villages
  );
}

module.exports = { getCrabeEmbed, getFindOptions };
