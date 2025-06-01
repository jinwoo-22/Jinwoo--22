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
      await send("🔄 BOT CLEANING........ ♻️");

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

      const msg = `✅ Bot has been successfully cleaned!\n📊 Clean Status: ${percent}% (${status})`;
      return send(msg);

    } catch (err) {
      console.error("❌ Error while cleaning the bot:", err);
      return send("❌ Error while cleaning the bot.\n📊 Clean Status: 0% (Bad ❌)");
    }
  }
};
