module.exports = {
  config: {
    name: "tag",
    aliases: [],
    version: "1.2.0",
    author: "SOJIB REZA ⚡",
    role: 0,
    shortDescription: "Reply diye tag with name only",
    longDescription: "Reply kore .tag dile shudhu tar name dekhabe ebong mention korbe",
    category: "utility",
    guide: {
      en: ".tag - Reply to someone's message and show only their name"
    }
  },

  onStart: async function ({ message, event, api }) {
    const { messageReply } = event;

    // ✅ Check if user replied to someone's message
    if (!messageReply) {
      return message.reply("❌ Please reply to someone's message to tag them by name.");
    }

    const tagID = messageReply.senderID;

    // 🔍 Get the name of the user being replied to
    let name = "unknown";
    try {
      const userInfo = await api.getUserInfo(tagID);
      name = userInfo[tagID]?.name || "unknown";
    } catch (err) {
      // If there's an error getting the name, default remains "unknown"
    }

    // ✅ Send the name as message and mention the person
    return message.send({
      body: name,
      mentions: [{
        id: tagID,
        tag: name
      }]
    });
  }
};
