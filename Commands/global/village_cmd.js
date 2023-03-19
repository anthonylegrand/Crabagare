const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const DATABASE = require("../../database");
const { Utilisateurs, Villages } = DATABASE.models;

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
    const GUILD_ID = interaction.guild.id;
    const OPTION_USER = interaction.options.getUser("utilisateur");
    const VILLAGE = await getVillage(
      GUILD_ID,
      interaction.user.id,
      OPTION_USER?.id
    );

    const embed = new EmbedBuilder()
      .setThumbnail((OPTION_USER || interaction.user).avatarURL())
      .setDescription("\u200B")
      .setTimestamp();

    if (VILLAGE) {
      embed
        .setColor("#27ae60")
        .setTitle(
          "🚀  Village de " +
            (OPTION_USER?.username || interaction.user.username)
        );
      embedAddFields(embed, {
        "Nom du Village": VILLAGE.nom || "N/A",
        Niveau: "🥇 " + VILLAGE.niveau,
        Coquillage: "🐚 " + VILLAGE.coquillage,
      });
    } else
      embed
        .setColor("#c0392b")
        .setTitle("🚨  " + (OPTION_USER?.username || interaction.user.username))
        .setDescription(
          `Oups, ${OPTION_USER.tag}, ne joue pas pour le moment !\nIl  peux commencer à jouer en utilisant la commande /village`
        );

    if (OPTION_USER)
      embed.setFooter({
        text: "Profil demandé par " + interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      });

    interaction.reply({ embeds: [embed] });
  },
};

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

function embedAddFields(embed, infos) {
  let fields = [];
  Object.keys(infos).map((key, i) =>
    fields.push({ name: key, value: infos[key].toString(), inline: i !== 0 })
  );
  embed.addFields(fields);
}
