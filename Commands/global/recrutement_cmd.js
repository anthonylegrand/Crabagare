const { SlashCommandBuilder } = require("discord.js");
const DATABASE = require("../../database");
const { Villages, Crabes } = DATABASE.models;
const { EmbedUtils, embedError, EMBED_COLOR } = require("../../embedsUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recrutement")
    .setDescription("Recrute un crabe !"),

  async execute(interaction) {
    try {
      const VILLAGE = await Villages.findOne({
        where: {
          UtilisateurDiscordId: interaction.user.id,
          discord_serveur_id: interaction.guild.id,
        },
        raw: true,
      });

      const dateActuelleMoins1Heure = new Date(Date.now() - 60 * 60 * 1000);
      if (VILLAGE) {
        if (VILLAGE.adoption_cmd < dateActuelleMoins1Heure) {
          Villages.update(
            {
              adoption_cmd: new Date(),
            },
            {
              where: {
                UtilisateurDiscordId: interaction.user.id,
                discord_serveur_id: interaction.guild.id,
              },
              limit: 1,
            }
          );
          if (youWinCrab()) {
            createCrab(interaction.user.v);

            const gagneCrabe = new EmbedUtils({
              interaction,
              title: "Tu as gagné 1 crabe !",
              color: EMBED_COLOR.ORANGE,
              profilThumbnail: false,
            });
            return interaction.reply({
              embeds: [gagneCrabe.getEmbed()],
            });
          } else {
            const pasDeCrabe = new EmbedUtils({
              interaction,
              title: "Tu n'es pas très chanceux ...",
              color: EMBED_COLOR.ORANGE,
              profilThumbnail: false,
            });
            return interaction.reply({
              embeds: [pasDeCrabe.getEmbed()],
            });
          }
        } else {
          const NOW = new Date(Date.now()).getTime();
          const date =
            new Date(VILLAGE.adoption_cmd).getTime() +
            60 * 60 * 1000 -
            NOW +
            NOW;

          const tropTôt = new EmbedUtils({
            interaction,
            title:
              "Patiente encore un peu pour la commande. \n Tu pourras la faire <t:" +
              Math.floor(date / 1000) +
              ":R>",
            color: EMBED_COLOR.ORANGE,
            profilThumbnail: false,
          });
          return interaction.reply({
            embeds: [tropTôt.getEmbed()],
          });
        }
      } else {
        const creerTonVillage = new EmbedUtils({
          interaction,
          title:
            "Tu n'as pas encore créer ton village, donc tu ne peux pas recruter de crabes",
          color: EMBED_COLOR.ORANGE,
          profilThumbnail: false,
        });
        return interaction.reply({
          embeds: [creerTonVillage.getEmbed()],
        });
      }
    } catch (error) {
      console.log(error);
      return interaction.reply({
        embeds: [
          embedError(error, "/recrutement", interaction.guild.id).getEmbed(),
        ],
      });
    }
  },
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function youWinCrab() {
  const randomInt = getRandomInt(0, 100);
  console.log(randomInt);
  return randomInt < 70;
}

async function createCrab(villageid) {
  return Crabes.create({ VillagesId: villageid, nom: "Franzou" });
}
