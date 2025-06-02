const moment = require("moment");

module.exports = {
  config: {
    name: "adminlist",
    aliases: ["admins", "admin"],
    version: "3.7",
    author: "GPT X SOJIB ⚡",
    countDown: 0,
    role: 0,
    shortDescription: "Show admin list or add/remove admins",
    longDescription: "Displays owner and admin list. Add/remove admins by replying, tagging, or typing UID with 'admin add/remove'.",
    category: "info",
    guide: {
      en: "admin — Show admin list\nReply, tag or type UID with 'admin add/remove'"
    }
  },

  onStart: async function ({ message, event, usersData }) {
    const { adminBot = [], ownerBot = [] } = global.GoatBot.config;
    const text = (event.body || "").toLowerCase();
    const ownerId = ownerBot[0];
    const adminList = [...new Set(adminBot)].filter(uid => uid && typeof uid === "string");

    // Collect target UIDs
    const targetIDs = new Set();

    // 1. From replied message
    if (event.type === "message_reply" && event.messageReply?.senderID) {
      targetIDs.add(event.messageReply.senderID);
    }

    // 2. From mentions
    if (event.mentions && typeof event.mentions === "object") {
      for (const uid in event.mentions) {
        targetIDs.add(uid);
      }
    }

    // 3. From text (e.g., "admin add 1000123456789")
    const uidMatches = text.match(/\b\d{10,20}\b/g);
    if (uidMatches) {
      uidMatches.forEach(uid => targetIDs.add(uid));
    }

    const targets = Array.from(targetIDs);

    // Handle admin add/remove
    if (text.includes("admin add") || text.includes("admin remove")) {
      if (targets.length === 0) {
        return message.reply("❌ Please reply, tag or provide UID(s) to add/remove admin(s).");
      }

      let added = 0, removed = 0;

      if (text.includes("admin add")) {
        for (const uid of targets) {
          if (!adminBot.includes(uid)) {
            adminBot.push(uid);
            added++;
          }
        }
      }

      if (text.includes("admin remove")) {
        for (const uid of targets) {
          const index = adminBot.indexOf(uid);
          if (index !== -1) {
            adminBot.splice(index, 1);
            removed++;
          }
        }
      }

      if (added > 0) return message.reply(`✅ Added admin role to ${added} user${added > 1 ? "s" : ""}.`);
      if (removed > 0) return message.reply(`✅ Removed admin role from ${removed} user${removed > 1 ? "s" : ""}.`);

      return message.reply("⚠️ No changes were made.");
    }

    // Display admin panel
    const uptimeSec = process.uptime();
    const uptimeStr = moment.utc(uptimeSec * 1000).format("HH:mm:ss");
    const ownerName = "SOJIB REZA ⚡";

    const adminNames = await Promise.all(
      adminList
        .filter(uid => uid !== ownerId)
        .map(async uid => {
          try {
            const name = await usersData.getName(uid);
            if (name && name.toLowerCase() !== "facebook user") return name;
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
