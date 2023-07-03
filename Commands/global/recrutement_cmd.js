const { SlashCommandBuilder } = require("discord.js");
const DATABASE = require("../../database");
const { faker } = require("@faker-js/faker");
const { Villages, Crabes, Pictures } = DATABASE.models;
const { EmbedUtils, embedError, EMBED_COLOR } = require("../../embedsUtils");
const CHANCE = 50;
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
        const levelVillage = VILLAGE.niveau;
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
          if (youWinCrab(levelVillage)) {
            const crabe = await createCrab(VILLAGE.id);

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
          const DISPO_DANS =
            new Date(VILLAGE.adoption_cmd).getTime() + 60 * 60 * 1000 - NOW;
          const date = DISPO_DANS + NOW;

          const tropTôt = new EmbedUtils({
            interaction,
            title:
              "Patiente encore un peu pour la commande. \n Tu pourras la faire <t:" +
              Math.floor(date / 1000) +
              ":R>",
            color: EMBED_COLOR.ORANGE,
            profilThumbnail: false,
          });
          return interaction
            .reply({
              embeds: [tropTôt.getEmbed()],
            })
            .then((m) =>
              setTimeout(
                () => m.delete(),
                DISPO_DANS < 60000 ? DISPO_DANS : 60000
              )
            );
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

function youWinCrab(levelVillage) {
  const randomInt = getRandomInt(0, 100);
  return randomInt < CHANCE + levelVillage;
}

async function getImage() {
  const randomItem = await Pictures.findOne({
    order: DATABASE.random(),
    raw: true,
  });

  return randomItem;
}

async function createCrab(villageid) {
  const myImage = await getImage();
  return Crabes.create({
    VillageId: villageid,
    nom: faker.name.firstName(),
    PictureId: myImage.id,
    TravailleTypeId: 1,
  });
}
