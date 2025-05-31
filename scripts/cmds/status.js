const os = require("os");

module.exports = {
  config: {
    name: "status",
    version: "1.5",
    role: 0,
    author: "GPT X SOJIB ⚡",
    shortDescription: "📊 Bot system info",
    longDescription: "Show stylish status with runtime, RAM, CPU & system info!",
    category: "info",
    guide: {
      en: "{pn} — Displays bot system status"
    }
  },

  onStart: async function ({ message }) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const usedMem = process.memoryUsage().heapUsed / 1024 / 1024;
    const totalMem = os.totalmem() / 1024 / 1024;

    const cpu = os.cpus()[0].model;
    const cores = os.cpus().length;
    const platform = os.platform();
    const arch = os.arch();

    const statusBox = `
╔════════════════════════════════╗
║         🤖 BOT STATUS 📶         ║
╠════════════════════════════════╣
║ 🕒 Uptime   : ${hours}h ${minutes}m ${seconds}s
║ 📦 RAM      : ${usedMem.toFixed(2)} MB / ${totalMem.toFixed(2)} MB
║ 🧠 CPU      : ${cpu}
║ 🧩 Cores    : ${cores}
║ 💻 System   : ${platform} (${arch})
║ 👑 Owner    : SOJIB REZA ⚡
╚════════════════════════════════╝`;

    return message.reply(statusBox);
  }
};
