module.exports = {
  config: {
    name: "uptime",
    aliases: ["run", "up"],
    version: "1.2",
    role: 0,
    author: "GPT X SOJIB ⚡",
    countDown: 2,
    longDescription: "Show bot running time",
    category: "system",
    guide: {
      en: "{pn} - Show how long the bot has been running"
    }
  },

  onStart: async function ({ message }) {
    const totalSeconds = process.uptime();
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    return message.reply(
`╭━━━━━━━━━━━━━━━━━╮
┃ 🤖  BOT IS RUNNING...
┃ 
┃ ⏱️ UPTIME: ${uptime}
┃ 👑 OWNER: SOJIB REZA ⚡
╰━━━━━━━━━━━━━━━━━╯`
    );
  }
};
