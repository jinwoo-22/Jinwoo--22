const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "clear",
    aliases: ["botclean", "clean"],
    version: "1.0.0",
    author: "SOJIB X GPT",
    countDown: 5,
    role: 1, // Only admin can use
    shortDescription: "Clear bot temporary files",
    longDescription: "Cleans the bot's cache and temporary data",
    category: "system",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const send = msg => api.sendMessage(msg, event.threadID);

    try {
      // Initial cleaning message
      await send("🔄 BOT CLEANING........ ♻️");

      const cacheDir = path.join(__dirname, "..", "..", "cache");
      const tmpDir = path.join(__dirname, "..", "..", "tmp");

      // Function to clear a folder
      function clearFolder(dirPath) {
        if (fs.existsSync(dirPath)) {
          for (const file of fs.readdirSync(dirPath)) {
            const filePath = path.join(dirPath, file);
            if (fs.lstatSync(filePath).isFile()) {
              fs.unlinkSync(filePath);
            }
          }
        }
      }

      // Clear both cache and tmp folders
      clearFolder(cacheDir);
      clearFolder(tmpDir);

      // Success message
      return send("✅ Bot has been successfully cleaned!");

    } catch (err) {
      console.error("❌ Error while cleaning the bot:", err);
      return send("❌ Error while cleaning the bot. See console for details.");
    }
  }
};
