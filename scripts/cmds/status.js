const os = require("os");

module.exports = {
  config: {
    name: "status",
    version: "1.1",
    role: 0,
    author: "Sojib Reza ⚡",
    shortDescription: "Shows bot status",
    longDescription: "Displays runtime, RAM, CPU usage and system info",
    category: "info",
    guide: {
      en: "{pn} - Shows the current status of the bot"
    }
  },

  onStart: async function ({ message }) {
    // Bot uptime in seconds
    const uptimeSeconds = process.uptime();
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    // RAM usage in MB
    const usedRAM = process.memoryUsage().heapUsed / 1024 / 1024;
    const totalRAM = os.totalmem() / 1024 / 1024;

    // CPU info
    const cpuModel = os.cpus()[0].model;
    const cpuCores = os.cpus().length;

    const statusMsg =
      `🤖 Bot Status:\n\n` +
      `⏳ Uptime: ${hours}h ${minutes}m ${seconds}s\n` +
      `🧠 RAM Usage: ${usedRAM.toFixed(2)} MB / ${totalRAM.toFixed(2)} MB\n` +
      `💻 CPU: ${cpuModel} (${cpuCores} cores)\n` +
      `🖥️ Platform: ${os.platform()} - ${os.arch()}\n\n` +
      `👑 Owner: SOJIB REZA ⚡`;

    return message.reply(statusMsg);
  }
};
