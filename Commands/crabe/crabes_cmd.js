require("dotenv").config();
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const sequelize = require("sequelize");
const DATABASE = require("../../database");
const { Villages, Crabes, Travaille_Types, Pictures } = DATABASE.models;
const { EmbedUtils, EMBED_COLOR, embedError } = require("../../embedsUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crabes")
    .setDescription("Afficher tous les crabes de mon village")
    .addStringOption((option) =>
      option
        .setName("nom")
        .setDescription(
          "Filtrer les crabes qui contiennent la suite de caractères suivants"
        )
    )
    .addStringOption((option) =>
      option
        .setName("travaille")
        .setDescription("Filtrer les crabes qui on ce travaille")
        .addChoices(
          { name: "Aucun", value: "1" },
          { name: "Soigneur", value: "2" },
          { name: "Constructeur", value: "3" },
          { name: "Cuisinier", value: "4" },
          { name: "Mineur", value: "5" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("niveau_min")
        .setDescription("Filtrer les crabes qui ont un plus grand niveaux")
    )
    .addIntegerOption((option) =>
      option
        .setName("niveau_max")
        .setDescription("Filtrer les crabes qui ont un plus petit niveaux")
    ),
  async execute(interaction) {
    try {
      await displayPage(interaction);
    } catch (error) {
      console.log(error);
      return interaction.reply({
        embeds: [embedError(error, "/crabes", interaction.guild.id).getEmbed()],
      });
    }
  },
};

async function displayPage(interaction, page = 0, buttonInteraction = null) {
  const nom = interaction.options.getString("nom");
  const travaille = interaction.options.getString("travaille");
  const niveau_min = interaction.options.getInteger("niveau_min");
  const niveau_max = interaction.options.getInteger("niveau_max");

  const DATA = {
    nom,
    travaille,
    niveau_min,
    niveau_max,
    DISCORD_ID: interaction.guild.id,
    USER_ID: interaction.user.id,
  };

  const CRABES = await fetchCrabes({ ...DATA, page });
  const embed = getCrabeEmbed(CRABES, interaction, page);
  const Buttons = getButtons();
  listenButtonsEvent(interaction, embed, page, CRABES.count);

  const reply = {
    content: `Fin de l'interaction <t:${Math.floor(
      (Date.now() + 10 * 1600) / 1000
    )}:R>`,
    embeds: [embed.getEmbed()],
    components: [Buttons],
  };

  if (buttonInteraction === null) interaction.reply(reply);
  else buttonInteraction.update(reply);
}

function getCrabeEmbed(CRABES, interaction, page) {
  return new EmbedUtils({
    interaction,
    title: `🦀 ${CRABES.rows[0].nom}`,
    color: EMBED_COLOR.PURPLE,
    profilThumbnail: false,
  })
    .setFooter(
      `Appartient à %username% - ${page + 1}/${CRABES.count}`,
      interaction.user.avatarURL()
    )
    .setImage(
      process.env.PICTURES_PREFIX_URL + CRABES.rows[0]["Picture.nom"] + ".png"
    )
    .addFields(
      {
        Niveau: "🍼 " + CRABES.rows[0].niveau.toString(),
        Vie: "💖 " + CRABES.rows[0].vie.toString() + "/100",
        ["\u200B"]: "\u200B",
      },
      [0, 1, 2]
    )
    .addFields(
      {
        Pince: "🗡️ " + CRABES.rows[0].niveau_pinces.toString(),
        Carapace: "🛡️ " + CRABES.rows[0].niveau_carapace.toString(),
        Travaille: "🏛️ " + CRABES.rows[0]["Travaille_Type.type"].toString(),
      },
      [0, 1, 2]
    );
}

function getButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("Precedent")
      .setLabel("Précédent")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("Suivant")
      .setLabel("Suivant")
      .setStyle(ButtonStyle.Primary)
  );
}

function listenButtonsEvent(interaction, embed, page, count) {
  const filter = (i) =>
    (i.customId === "Precedent" || i.customId === "Suivant") &&
    i.user.id === interaction.user.id;

  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    time: 15000,
    max: 1,
  });

  collector.on("collect", async (i) => {
    if (i.customId === "Precedent") page = page <= 0 ? count - 1 : page - 1;
    else if (i.customId === "Suivant") page = page + 1 >= count ? 0 : page + 1;

    displayPage(interaction, page, i);
  });

  collector.on("end", async (c) => {
    if (c.size === 0)
      await interaction.editReply({
        content: "",
        embeds: [embed.getEmbed().setColor(EMBED_COLOR.RED)],
        components: [],
      });
  });
}

async function fetchCrabes(DATA) {
  const SQL = await createSubRequestVillage(DATA);
  const where = createWhereObject(DATA);

  return Crabes.findAndCountAll({
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
    order: [["id", "DESC"]],
    limit: 1,
    offset: DATA.page,
    raw: true,
  });
}

async function createSubRequestVillage({ DISCORD_ID, USER_ID }) {
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

function createWhereObject({ nom, travaille, niveau_min, niveau_max }) {
  let where = {};
  if (nom) where["nom"] = { [sequelize.Op.iLike]: "%" + nom + "%" };
  if (travaille !== null)
    where["TravailleTypeId"] =
      travaille === "0"
        ? { [sequelize.Op.is]: null }
        : { [sequelize.Op.eq]: travaille };
  if (niveau_min || niveau_max)
    where["niveau"] = {
      [sequelize.Op.or]: {
        [sequelize.Op.gte]: niveau_min || 0,
        [sequelize.Op.lte]: niveau_max || 999,
      },
    };
  return where;
}
