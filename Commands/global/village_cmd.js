const { SlashCommandBuilder } = require("discord.js");
const DATABASE = require("../../database");
const { Utilisateurs, embedError, Villages } = DATABASE.models;
const {
  EmbedUtils,
  EMBED_COLOR,
  DEFAULT_AUTHOR,
  AHTHOR_ICON_URL,
} = require("../../embedsUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("village")
    .setDescription("Afficher mon village sur ce serveur")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("Afficher le village d'un autre utilisateur")
    ),
  async execute(interaction) {
    try {
      const GUILD_ID = interaction.guild.id;
      const OPTION_USER = interaction.options.getUser("utilisateur");
      const VILLAGE = await getVillage(
        GUILD_ID,
        interaction.user.id,
        OPTION_USER?.id
      );

      const embed = new EmbedUtils({
        interaction,
        profilThumbnail: true,
      }).setDescription("\u200B");

      if (VILLAGE) {
        embed
          .setColor(EMBED_COLOR.GREEN)
          .setTitle("🚀 Village de %username%")
          .addFields(
            {
              "Nom du Village": VILLAGE.nom || "N/A",
              Niveau: "🥇 " + VILLAGE.niveau,
              Coquillage: "🐚 " + VILLAGE.coquillage,
            },
            [1, 2]
          );
      } else
        embed
          .setColor(EMBED_COLOR.RED)
          .setTitle("🚨  %username%")
          .setDescription(
            `Oups, ${OPTION_USER.tag}, ne joue pas pour le moment !\nIl  peux commencer à jouer en utilisant la commande /village`
          );

      if (new Date(VILLAGE.createdAt) > new Date(Date.now() - 1000 * 2.5))
        interaction.reply({
          embeds: [getEmbedCreation(interaction).getEmbed(), embed.getEmbed()],
        });
      else
        interaction.reply({
          embeds: [embed.getEmbed()],
        });
    } catch (error) {
      return interaction.reply({
        embeds: [
          embedError(error, "/village", interaction.guild.id).getEmbed(),
        ],
      });
    }
  },
};

/* DATABASE REQUESTS */

async function getVillage(GUILD_ID, USER_ID, OTHER_USER_ID) {
  const VILLAGE = await Villages.findOne({
    where: {
      UtilisateurDiscordId: OTHER_USER_ID || USER_ID,
      discord_serveur_id: GUILD_ID,
    },
    include: Utilisateurs,
    raw: true,
  });

  if (VILLAGE || OTHER_USER_ID != null) return VILLAGE;
  return createVillage(GUILD_ID, USER_ID);
}

async function createVillage(GUILD_ID, USER_ID) {
  if (await hasProfil(USER_ID)) {
    let adoption_cmd = new Date();
    adoption_cmd.setHours(adoption_cmd.getHours() - 1);

    return Villages.create({
      UtilisateurDiscordId: USER_ID,
      discord_serveur_id: GUILD_ID,
      adoption_cmd,
    });
  }
}

async function hasProfil(USER_ID) {
  return Utilisateurs.findOrCreate({
    where: {
      Discord_id: USER_ID,
    },
  });
}

function getEmbedCreation(interaction) {
  return new EmbedUtils({
    interaction,
    title: "Bienvenue dans le jeux **Crabaggare**",
    color: EMBED_COLOR.ORANGE,
    profilThumbnail: false,
  })
    .setDescription(
      "Ton village vient d'être créer.\n\nTu peux utiliser la commande **/aide** pour voire la liste des commandes."
    )
    .setAuthor(DEFAULT_AUTHOR)
    .setThumbnail(AHTHOR_ICON_URL);
}
