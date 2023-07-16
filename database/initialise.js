module.exports = (sequelize) => {
  const CMD_ARGS = process.argv.slice(2).join(" ");

  const DB_OPTION = CMD_ARGS.includes("--resetdb=true")
    ? { force: true, alter: false }
    : { force: false, alter: true };

  sequelize.sync(DB_OPTION).then(() => {
    console.log("Drop and Resync Database with " + JSON.stringify(DB_OPTION));
  });
};
