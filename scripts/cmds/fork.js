const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "fork",
    aliases: ["repo", "source"],
    version: "1.0.1",
    author: "SOJIB X GPT ⚡",
    countDown: 5,
    role: 2, // ✅ Only owner can use
    shortDescription: "Get bot fork link",
    longDescription: "Returns the repository link to fork the bot (owner only)",
    category: "info",
    guide: {
      en: "{pn} - Show the bot's fork repository link"
    }
  },

  onStart: async function ({ message }) {
    try {
      const packagePath = path.join(__dirname, "..", "..", "package.json");
      const packageData = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
      const repoUrl = packageData.repository?.url || null;

      if (!repoUrl) {
        return message.reply("❌ Couldn't find fork link in package.json.");
      }

      const cleanUrl = repoUrl.replace(/^git\+/, "").replace(/\.git$/, "");

      return message.reply(
`🌿 Fork this bot from the link below:
🔗 ${cleanUrl}`
      );
    } catch (err) {
      console.error("❌ Error fetching fork link:", err);
      return message.reply("❌ An error occurred while fetching the fork link.");
    }
  }
};
