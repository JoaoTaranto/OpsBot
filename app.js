const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const HLTV = require("hltv-api").default;
const { Client, Collection, GatewayIntentBits } = require("discord.js");

// Criação de Instancias CLientes/Apps
const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((key) => GatewayIntentBits[key]),
});

const hltv_app = express();

hltv_app.listen(3000, () => {
  console.log(`API listening on port 3000`);
});

hltv_app.get("/", async (req, res) => {
  const news = await HLTV.getNews();
  res.json(news);
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
