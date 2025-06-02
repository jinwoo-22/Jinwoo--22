const moment = require("moment-timezone");
const axios = require("axios");

module.exports = {
  config: {
    name: "welcome",
    version: "2.0",
    author: "SOJIB REZA ⚡",
    category: "events"
  },

  onStart: async function ({ event, message, api, threadsData }) {
    if (event.logMessageType !== "log:subscribe") return;

    const threadID = event.threadID;
    const threadData = await threadsData.get(threadID);
    const addedUsers = event.logMessageData.addedParticipants;
    const adderID = event.logMessageData.author;
    const adderInfo = await api.getUserInfo(adderID);
    const adderName = adderInfo[adderID]?.name || "Someone";

    if (addedUsers.some(user => user.userFbId === api.getCurrentUserID())) {
      return message.send("🌸 ᴛʜᴀɴᴋꜱ ꜰᴏʀ ᴀᴅᴅɪɴɢ ᴍᴇ ʜᴇʀᴇ!");
    }

    const names = addedUsers.map(u => u.fullName).join(", ");
    const mentions = addedUsers.map(u => ({ tag: u.fullName, id: u.userFbId }));

    // Get time & date
    const time = moment().tz("Asia/Dhaka").format("h:mm A");
    const date = moment().tz("Asia/Dhaka").format("dddd, MMMM Do YYYY");

    // Get weather
    let weatherText = "";
    try {
      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=24.4&longitude=88.6&current_weather=true`
      );
      const { temperature, weathercode } = weatherRes.data.current_weather;
      weatherText = `🌤️ ${temperature}°C`;
    } catch (e) {
      weatherText = "🌤️ Weather info unavailable";
    }

    const welcomeMsg = `
╔═══ ❖ 🌺 Wᴇʟᴄᴏᴍᴇ 🌺 ❖ ═══╗
✨ Hello, ${names}!
🌼 Welcome to ★ ${threadData.threadName} ★
🕒 Time: ${time}
📅 Date: ${date}
${weatherText}
🫶 Hope you enjoy your time here!

👤 Added by: ${adderName}
╚════════════════════╝`;

    message.send({ body: welcomeMsg, mentions });
  }
};
