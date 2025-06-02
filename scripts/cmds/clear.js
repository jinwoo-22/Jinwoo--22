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
    try {
      // Send initial cleaning message and keep message ID
      const info = await api.sendMessage("🔄 BOT CLEANING........ ♻️", event.threadID);

      const cacheDir = path.join(__dirname, "..", "..", "cache");
      const tmpDir = path.join(__dirname, "..", "..", "tmp");

      let totalFiles = 0;
      let deletedFiles = 0;

      function clearFolder(dirPath) {
        if (fs.existsSync(dirPath)) {
          const files = fs.readdirSync(dirPath);
          totalFiles += files.length;
          for (const file of files) {
            const filePath = path.join(dirPath, file);
            if (fs.lstatSync(filePath).isFile()) {
              try {
                fs.unlinkSync(filePath);
                deletedFiles++;
              } catch (e) {
                // Ignore deletion errors
              }
            }
          }
        }
      }

      clearFolder(cacheDir);
      clearFolder(tmpDir);

      const percent = totalFiles > 0 ? Math.round((deletedFiles / totalFiles) * 100) : 100;
      const status = percent >= 70 ? "Good ✅" : "Bad ❌";

      const finalMsg = `✅ Bot has been successfully cleaned!\n📊 Clean Status: ${percent}% (${status})`;

      // Unsend the initial cleaning message
      await api.unsendMessage(info.messageID);

      // Send final cleaning status message
      return api.sendMessage(finalMsg, event.threadID);

    } catch (err) {
      console.error("❌ Error while cleaning the bot:", err);
      return api.sendMessage("❌ Error while cleaning the bot.\n📊 Clean Status: 0% (Bad ❌)", event.threadID);
    }
  }
};
