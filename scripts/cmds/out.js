const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
	config: {
		name: "Out",
		aliases: ["l"],
		version: "1.0",
		author: "Sandy + Modified by Sojib",
		countDown: 5,
		role: 2,
		shortDescription: "bot will leave gc",
		longDescription: "",
		category: "admin",
		guide: {
			vi: "{pn} [tid,blank]",
			en: "{pn} [tid,blank]"
		}
	},

	onStart: async function ({ api, event, args }) {
		let id;
		if (!args.join(" ")) {
			id = event.threadID;
		} else {
			id = parseInt(args.join(" "));
		}

		const time = new Date().toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
			timeZone: 'Asia/Dhaka'
		});

		const leaveMessage = 
`🖤 𝗝 𝗜 𝗡 𝗪 𝗢 𝗢  𝗟𝗘𝗔𝗩𝗘

🎀 Bye guys...

🕘 Leave time: ${time}`;

		return api.sendMessage(leaveMessage, id, () => {
			api.removeUserFromGroup(api.getCurrentUserID(), id);
		});
	}
}
