const moment = require("moment");

module.exports = {
  config: {
    name: "adminlist",
    aliases: ["admins", "admin"],
    version: "3.6",
    author: "GPT X SOJIB ⚡",
    countDown: 0,
    role: 0,
    shortDescription: "Show admin list or add/remove admins",
    longDescription: "Displays owner and admin list. Add/remove admins by reply or tagging users with 'admin add' or 'admin remove'.",
    category: "info",
    guide: {
      en: "admin — Show admin list\nReply to a user or tag users with 'admin add' or 'admin remove' to add or remove admins"
    }
  },

  onStart: async function ({ message, event, usersData }) {
    const { adminBot = [], ownerBot = [] } = global.GoatBot.config;
    const text = (event.body || "").toLowerCase();
    const ownerId = ownerBot[0];
    const adminList = [...new Set(adminBot)].filter(uid => uid && typeof uid === "string");

    // Collect target user IDs (from reply or mentions)
    let targetIDs = new Set();

    // 1. If it's a reply, add the replied-to user's ID
    if (event.type === "message_reply" && event.messageReply && event.messageReply.senderID) {
      targetIDs.add(event.messageReply.senderID);
    }

    // 2. Add mentioned/tagged users from the message
    if (event.mentions && typeof event.mentions === "object") {
      for (const uid in event.mentions) {
        if (event.mentions.hasOwnProperty(uid)) {
          targetIDs.add(uid);
        }
      }
    }

    const targets = Array.from(targetIDs);

    // Handle admin add/remove commands
    if (text.includes("admin add") || text.includes("admin remove")) {
      if (targets.length === 0) {
        return message.reply("❌ Please reply to a user or tag users to add or remove admin roles.");
      }

      let addedCount = 0;
      let removedCount = 0;

      if (text.includes("admin add")) {
        for (const uid of targets) {
          if (!adminBot.includes(uid)) {
            adminBot.push(uid);
            addedCount++;
          }
        }
      }

      if (text.includes("admin remove")) {
        for (const uid of targets) {
          const index = adminBot.indexOf(uid);
          if (index !== -1) {
            adminBot.splice(index, 1);
            removedCount++;
          }
        }
      }

      if (addedCount > 0) {
        return message.reply(`✅ Admin role added for ${addedCount} user${addedCount > 1 ? "s" : ""}.`);
      }
      if (removedCount > 0) {
        return message.reply(`✅ Admin role removed for ${removedCount} user${removedCount > 1 ? "s" : ""}.`);
      }

      return message.reply("⚠️ No changes were made.");
    }

    // Otherwise show admin panel
    const uptimeSec = process.uptime();
    const uptimeStr = moment.utc(uptimeSec * 1000).format("HH:mm:ss");
    const ownerName = "SOJIB REZA ⚡";

    const adminNames = await Promise.all(
      adminList
        .filter(uid => uid !== ownerId)
        .map(async uid => {
          try {
            const name = await usersData.getName(uid);
            if (name && name.toLowerCase() !== "facebook user") {
              return name;
            }
            return null;
          } catch {
            return null;
          }
        })
    );

    const filteredAdmins = adminNames.filter(Boolean);

    const msg = `🛡️ ADMIN PANEL 🛡️

👑 OWNER:
• ${ownerName}

🔹 ADMINS:
${filteredAdmins.length > 0 ? filteredAdmins.map(name => `• ${name}`).join("\n") : "• No admins found."}

⏱️ BOT UPTIME: ${uptimeStr}`;

    return message.reply(msg);
  }
};
