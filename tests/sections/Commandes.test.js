const { Section, Test } = require("./../utils");

module.exports = () => {
  Section("Test des commandes", [
    new Test("Test de la commande /crabe").runCommand("crabe").whantAnswer(),
    new Test("Test de la commande /profil").runCommand("profil").whantAnswer(),
  ]);
};
