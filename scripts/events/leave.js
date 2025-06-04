const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
	config: {
		name: "Out",
		aliases: ["l"],
		version: "1.5",
		author: "Sandy + Modified by Sojib",
		countDown: 5,
		role: 2,
		shortDescription: "Bot leaves group stylishly",
		longDescription: "",
		category: "admin",
		guide: {
			en: "{pn}"
		}
	},

	onStart: async function ({ api, event, args }) {
		let id = args.length ? parseInt(args.join(" ")) : event.threadID;

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

		api.sendMessage(leaveMessage, id, () => {
			api.removeUserFromGroup(api.getCurrentUserID(), id);
		});
	}
		}
