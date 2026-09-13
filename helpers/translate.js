const deepl = require("deepl-node");
const trad = new deepl.Translator(process.env.DEEPL_AUTH_KEY);

const translateContent = async (content) => {
  if (!content) return content;
  const translatedContent = await trad.translateText(content, "en-US", "pt-BR");

  return translatedContent.text;
};

module.exports = { translateContent };
