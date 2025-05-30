const fs = require("fs");
const path = require("path");

const whitelistPath = path.join(__dirname, "../data/groupWhitelist.json");

if (!fs.existsSync(whitelistPath)) {
  fs.writeFileSync(whitelistPath, JSON.stringify({}));
}

module.exports = {
  config: {
    name: "wl2",
    aliases: [],
    version: "1.4",
    author: "SOJIB REZA",
    description: "Manage whitelist members and toggle whitelist mode",
    usage: "wl2 [add/remove/on/off/list] @mention",
    cooldown: 3
  },

  onStart: async function ({ message, event, usersData, args, api }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const whitelistDB = JSON.parse(fs.readFileSync(whitelistPath, "utf-8"));
    const ADMINBOT = global.GoatBot.config.ADMINBOT || [];
    const BOT_OWNER = api.getCurrentUserID();

    if (!whitelistDB[threadID]) {
      whitelistDB[threadID] = { enabled: false, members: [] };
    }

    const command = args[0];
    const mentions = event.mentions;
    const mentionIDs = Object.keys(mentions);

    // ✅ Whitelist ON/OFF - Only for Owner/Admins
    if (["on", "off"].includes(command)) {
      const isAuthorized = senderID === BOT_OWNER || ADMINBOT.includes(senderID);
      if (!isAuthorized) {
        return message.reply("⛔ Only bot owner or admins can toggle whitelist mode.");
      }

      whitelistDB[threadID].enabled = command === "on";
      fs.writeFileSync(whitelistPath, JSON.stringify(whitelistDB, null, 2));

      return message.reply(
        command === "on"
          ? "✅ ACTIVATED WHITE LIST MODE"
          : "☑️ DEACTIVATED WHITE LIST MODE"
      );
    }

    // ➕ Add to whitelist
    if (command === "add" && mentionIDs.length > 0) {
      const added = [];
      for (const id of mentionIDs) {
        if (!whitelistDB[threadID].members.includes(id)) {
          whitelistDB[threadID].members.push(id);
          added.push(mentions[id]);
        }
      }
      fs.writeFileSync(whitelistPath, JSON.stringify(whitelistDB, null, 2));
      return message.reply("✅ ADDED TO WHITE LIST: " + added.join(", "));
    }

    // ➖ Remove from whitelist
    if (command === "remove" && mentionIDs.length > 0) {
      whitelistDB[threadID].members = whitelistDB[threadID].members.filter(id => !mentionIDs.includes(id));
      fs.writeFileSync(whitelistPath, JSON.stringify(whitelistDB, null, 2));
      return message.reply("☑️ REMOVED FROM WHITE LIST: " + mentionIDs.map(id => mentions[id]).join(", "));
    }

    // 📋 List members
    if (command === "list") {
      const members = whitelistDB[threadID].members;
      if (members.length === 0) return message.reply("⚠️ Whitelist is currently empty.");
      const names = await Promise.all(
        members.map(uid => usersData.getName(uid))
      );
      return message.reply("📋 Whitelisted Members:\n" + names.join("\n"));
    }

    // ❗ Invalid usage
    return message.reply("❗ Usage: wl2 [on/off/add/remove/list] @mention");
  },

  // 🔇 Block non-whitelisted users if mode is on
  onChat: async function ({ event }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const whitelistDB = JSON.parse(fs.readFileSync(whitelistPath, "utf-8"));

    if (whitelistDB[threadID]?.enabled && !whitelistDB[threadID].members.includes(senderID)) {
      return; // silently ignore
    }
  }
};
