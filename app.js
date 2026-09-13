const fs = require("node:fs");
const path = require("node:path");
const app_api = require("./api/api.js");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

// Criação de Instancias CLientes/Apps
const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((key) => GatewayIntentBits[key]),
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
    console.log(`✅ Comando carregado: ${command.data.name}`);
  } else {
    console.log(`⚠️  Aviso: ${file} está faltando "data" ou "execute"`);
  }
}

app_api.listen(3000, () => {
  console.log(`HLTV API rodando em porta 3000`);
});

client.once("clientReady", () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const reply = {
      content: "Houve um erro ao executar esse comando!",
      ephemeral: true,
    };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});
client.login(process.env.DISCORD_TOKEN);
