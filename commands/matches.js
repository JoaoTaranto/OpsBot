const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("partidas")
    .setDescription("Visualize as próximas partidas.")
    .addStringOption((option) =>
      option
        .setName("teamname")
        .setDescription("Informe o nome do time:")
        .setRequired(true),
    ),

  async execute(interaction) {
    const csrep_user = interaction.options.getString(`idcustom`);
    await interaction.reply({
      content: "🔍 Pesquisando...",
      withResponse: true,
    });

    // Comunicação com API HLTV
    // await interaction.reply({ content: `Teste chamada command` });
  },
};
