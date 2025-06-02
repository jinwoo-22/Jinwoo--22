const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "pvm",
    aliases: ["private", "pvmon", "pvmo"],
    version: "1.0",
    author: "GPT x SOJIB ⚡",
    countDown: 5,
    role: 2, // Only owner can toggle
    shortDescription: "Toggle Private Mode (PVM)",
    longDescription: "Enable or disable private mode where only specific UIDs can use the bot including emoji responses.",
    category: "owner",
    guide: {
      en: "{pn} on - Enable Private Mode\n{pn} off - Disable Private Mode"
    }
  },

  onStart: async function ({ args, message }) {
    const config = global.GoatBot.config;

    // Ensure privateMode config exists
    if (!config.privateMode) {
      config.privateMode = {
        enable: false,
        allowedUIDs: []
      };
    }

    const subCmd = (args[0] || "").toLowerCase();

    if (subCmd === "on") {
      config.privateMode.enable = true;
      config.privateMode.allowedUIDs = ["61550628934323"];
      writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
      return message.reply("🔒 PRIVATE MODE ACTIVATED ✅");
    }

    if (subCmd === "off") {
      config.privateMode.enable = false;
      writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
      return message.reply("🔓 PRIVATE MODE DEACTIVATED ☑️");
    }

    return message.reply("⚠️ Use `{pn} on` or `{pn} off` to toggle Private Mode.");
  }
};
