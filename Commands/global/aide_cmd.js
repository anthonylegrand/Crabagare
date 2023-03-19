const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("aide")
    .setDescription("Besoin d'aide pour comprendre le bot ?"),
  async execute(interaction) {
    await interaction.reply(`Regarde tes messages privés pour l'aide !`);

    const embedPresentation = createEmbed("Crabaggare")
      .setURL(
        "https://search.brave.com/images?q=gros+chien+moche+et+gras&source=web"
      )
      .setAuthor({
        name: "Crabaggare",
        iconURL:
          "https://imgs.search.brave.com/ay6VVbHwluUX9Sh8tSmDCpgDBo_YIzzld8y1hvJoqfY/rs:fit:474:225:1/g:ce/aHR0cHM6Ly90c2Ux/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC4t/bW1GYlBGcWJfRXps/UXpnSS13Rjh3SGFI/YSZwaWQ9QXBp",
        url: "https://search.brave.com/images?q=gros+chien+moche+et+gras&source=web",
      })
      .setDescription(
        "Tout la partie d'aide des différentes commandes et explications du bot"
      )
      .setThumbnail(
        "https://imgs.search.brave.com/ay6VVbHwluUX9Sh8tSmDCpgDBo_YIzzld8y1hvJoqfY/rs:fit:474:225:1/g:ce/aHR0cHM6Ly90c2Ux/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC4t/bW1GYlBGcWJfRXps/UXpnSS13Rjh3SGFI/YSZwaWQ9QXBp"
      );

    const embedSimple = createEmbed("Commandes simples");
    addSection(embedSimple, "/profil {?Utilisateur}", [
      " - Affiche votre profil personnel ou celui de la personne recherchée, avec votre nombre de pince et le niveau du village.",
      " - Si la personne n'a jamais fais de / vilage (voir en dessous) alors le profil ne pourra pas être affihcé.",
    ]);
    addSection(embedSimple, "/village {?Utilisateur}", [
      " - Affiche les informations de votre village ou celui de la personne recherchée avec toute les informations le concernant.",
    ]);

    interaction.user.send({
      embeds: [embedPresentation, embedSimple],
    });
  },
};

function createEmbed(title) {
  return new EmbedBuilder().setColor("#e74c3c").setTitle(title).setTimestamp();
}

function addSection(embed, sectionTitle, rows = []) {
  let sectionValue = "";
  rows.map((r) => (sectionValue += r + "\n"));
  embed.addFields({ name: sectionTitle, value: sectionValue });
}
