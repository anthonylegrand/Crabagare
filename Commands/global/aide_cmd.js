const { SlashCommandBuilder } = require("discord.js");
const {
  EmbedUtils,
  EMBED_COLOR,
  DEFAULT_AUTHOR,
  AHTHOR_ICON_URL,
} = require("../../embedsUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("aide")
    .setDescription("Besoin d'aide pour comprendre le bot ?"),
  async execute(interaction) {
    await interaction.reply(`Regarde tes messages privés pour l'aide !`);

    const embedPresentation = new EmbedUtils({
      interaction,
      title: "Crabaggare",
      color: EMBED_COLOR.ORANGE,
      profilThumbnail: false,
    })
      .setDescription(
        "Tout la partie d'aide des différentes commandes et explications du bot"
      )
      .setAuthor(DEFAULT_AUTHOR)
      .setThumbnail(AHTHOR_ICON_URL);

    const embedSimple = new EmbedUtils({
      interaction,
      title: "Commandes simples",
      color: EMBED_COLOR.ORANGE,
      profilThumbnail: false,
    });

    addSection(embedSimple, "/profil {?Utilisateur}", [
      " - Affiche votre profil personnel ou celui de la personne recherchée, avec votre nombre de pince et le niveau du village.",
      " - Si la personne n'a jamais fais de / vilage (voir en dessous) alors le profil ne pourra pas être affihcé.",
    ]);
    addSection(embedSimple, "/village {?Utilisateur}", [
      " - Affiche les informations de votre village ou celui de la personne recherchée avec toute les informations le concernant.",
    ]);

    interaction.user.send({
      embeds: [embedPresentation.getEmbed(), embedSimple.getEmbed()],
    });
  },
};

function addSection(embed, sectionTitle, rows = []) {
  let sectionValue = "";
  rows.map((r) => (sectionValue += r + "\n"));
  embed.addFields({ [sectionTitle]: sectionValue });
}
