const { EmbedBuilder } = require("discord.js");
const DATABASE = require("./database");
const { ErrorsReport } = DATABASE.models;

const EMBED_COLOR = {
  GREEN: "#27ae60",
  RED: "#c0392b",
  ORANGE: "#d35400",
  PURPLE: "#8e44ad",
};

const AHTHOR_ICON_URL =
  "https://imgs.search.brave.com/ay6VVbHwluUX9Sh8tSmDCpgDBo_YIzzld8y1hvJoqfY/rs:fit:474:225:1/g:ce/aHR0cHM6Ly90c2Ux/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC4t/bW1GYlBGcWJfRXps/UXpnSS13Rjh3SGFI/YSZwaWQ9QXBp";

const DEFAULT_AUTHOR = {
  name: "Crabaggare",
  iconURL: AHTHOR_ICON_URL,
  url: "https://search.brave.com/images?q=gros+chien+moche+et+gras&source=web",
};

function embedError(error, source, discord_serveur_id) {
  ErrorsReport.create({
    discord_serveur_id,
    source,
    errorMessage: error.toString(),
    error: JSON.stringify({ ...error }),
  });

  return new EmbedUtils({
    title: "Une Erreur System est survenue",
    color: EMBED_COLOR.RED,
  });
}

class EmbedUtils {
  constructor(options) {
    const { interaction, title, color, profilThumbnail } = options;
    this.embed = new EmbedBuilder().setTimestamp();

    if (interaction) this.setInteraction(interaction);
    if (title) this.setTitle(title);
    if (color) this.setColor(color);
    if (profilThumbnail) this.setProfilThumbnail();
  }

  setInteraction(interaction, optionUserKey = "utilisateur") {
    const OPTION_USER = interaction.options.getUser(optionUserKey);
    this._user = interaction.user;
    this._optionUser = OPTION_USER;

    this._setAskedFooter();
    return this;
  }

  setColor(EMBED_COLOR) {
    this.embed.setColor(EMBED_COLOR);
    return this;
  }

  setTitle(title) {
    this.embed.setTitle(this._stringToValue(title));
    return this;
  }

  setDescription(description) {
    this.embed.setDescription(this._stringToValue(description));
    return this;
  }

  setImage(img_link) {
    this.embed.setImage(img_link);
    return this;
  }

  setThumbnail(img_link) {
    this.embed.setThumbnail(img_link);
    return this;
  }

  setProfilThumbnail() {
    this.embed.setThumbnail((this._optionUser || this._user).avatarURL());
    return this;
  }

  setAuthor(jsonAuthor) {
    this.embed.setAuthor(jsonAuthor);
    return this;
  }

  addFields(infos = {}, IndexInfoInlines = []) {
    let fields = [];
    Object.keys(infos).map((key, i) =>
      fields.push({
        name: key,
        value: this._stringToValue(infos[key].toString()),
        inline: IndexInfoInlines.includes(i),
      })
    );
    this.embed.addFields(fields);
    return this;
  }

  setFooter(text, iconURL) {
    if (!this._optionUser)
      this.embed.setFooter({
        text: this._stringToValue(text),
        iconURL,
      });
    return this;
  }

  _setAskedFooter() {
    if (this._optionUser)
      this.embed.setFooter({
        text: this._stringToValue("Profil demandé par " + this._user.username),
        iconURL: this._user.avatarURL(),
      });
  }

  _stringToValue(str) {
    return str.replace(
      "%username%",
      this._optionUser?.username || this._user?.username
    );
  }

  getEmbed() {
    return this.embed;
  }
}
module.exports = {
  EmbedUtils,
  EMBED_COLOR,
  AHTHOR_ICON_URL,
  DEFAULT_AUTHOR,
  embedError,
};
