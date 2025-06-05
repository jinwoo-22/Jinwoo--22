const fs = require("fs-extra");
const nullAndUndefined = [undefined, null];
// const { config } = global.GoatBot;
// const { utils } = global;

function getType(obj) {
	return Object.prototype.toString.call(obj).slice(8, -1);
}

function getRole(threadData, senderID) {
	const adminBot = global.GoatBot.config.adminBot || [];
	if (!senderID)
		return 0;
	const adminBox = threadData ? threadData.adminIDs || [] : [];
	return adminBot.includes(senderID) ? 2 : adminBox.includes(senderID) ? 1 : 0;
}

function getText(type, reason, time, targetID, lang) {
	const utils = global.utils;
	if (type == "userBanned")
		return utils.getText({ lang, head: "handlerEvents" }, "userBanned", reason, time, targetID);
	else if (type == "threadBanned")
		return utils.getText({ lang, head: "handlerEvents" }, "threadBanned", reason, time, targetID);
	else if (type == "onlyAdminBox")
		return utils.getText({ lang, head: "handlerEvents" }, "onlyAdminBox");
	else if (type == "onlyAdminBot")
		return utils.getText({ lang, head: "handlerEvents" }, "onlyAdminBot");
}

function replaceShortcutInLang(text, prefix, commandName) {
	return text
		.replace(/\{(?:p|prefix)\}/g, prefix)
		.replace(/\{(?:n|name)\}/g, commandName)
		.replace(/\{pn\}/g, `${prefix}${commandName}`);
}

function getRoleConfig(utils, command, isGroup, threadData, commandName) {
	let roleConfig;
	if (utils.isNumber(command.config.role)) {
		roleConfig = {
			onStart: command.config.role
		};
	}
	else if (typeof command.config.role == "object" && !Array.isArray(command.config.role)) {
		if (!command.config.role.onStart)
			command.config.role.onStart = 0;
		roleConfig = command.config.role;
	}
	else {
		roleConfig = {
			onStart: 0
		};
	}

	if (isGroup)
		roleConfig.onStart = threadData.data.setRole?.[commandName] ?? roleConfig.onStart;

	for (const key of ["onChat", "onStart", "onReaction", "onReply"]) {
		if (roleConfig[key] == undefined)
			roleConfig[key] = roleConfig.onStart;
	}

	return roleConfig;
	// {
	// 	onChat,
	// 	onStart,
	// 	onReaction,
	// 	onReply
	// }
}

function isBannedOrOnlyAdmin(userData, threadData, senderID, threadID, isGroup, commandName, message, lang) {
	const config = global.GoatBot.config;
	const { adminBot, hideNotiMessage } = config;

	// check if user banned
	const infoBannedUser = userData.banned;
	if (infoBannedUser.status == true) {
		const { reason, date } = infoBannedUser;
		if (hideNotiMessage.userBanned == false)
			message.reply(getText("userBanned", reason, date, senderID, lang));
		return true;
	}

	// check if only admin bot
	if (
		config.adminOnly.enable == true
		&& !adminBot.includes(senderID)
		&& !config.adminOnly.ignoreCommand.includes(commandName)
	) {
		if (hideNotiMessage.adminOnly == false)
			message.reply(getText("onlyAdminBot", null, null, null, lang));
		return true;
	}

	// ==========    Check Thread    ========== //
	if (isGroup == true) {
		if (
			threadData.data.onlyAdminBox === true
			&& !threadData.adminIDs.includes(senderID)
			&& !(threadData.data.ignoreCommanToOnlyAdminBox || []).includes(commandName)
		) {
			// check if only admin box
			if (!threadData.data.hideNotiMessageOnlyAdminBox)
				message.reply(getText("onlyAdminBox", null, null, null, lang));
			return true;
		}

		// check if thread banned
		const infoBannedThread = threadData.banned;
		if (infoBannedThread.status == true) {
			const { reason, date } = infoBannedThread;
			if (hideNotiMessage.threadBanned == false)
				message.reply(getText("threadBanned", reason, date, threadID, lang));
			return true;
		}
	}
	return false;
}


function createGetText2(langCode, pathCustomLang, prefix, command) {
	const commandType = command.config.countDown ? "command" : "command event";
	const commandName = command.config.name;
	let customLang = {};
	let getText2 = () => { };
	if (fs.existsSync(pathCustomLang))
		customLang = require(pathCustomLang)[commandName]?.text || {};
	if (command.langs || customLang || {}) {
		getText2 = function (key, ...args) {
			let lang = command.langs?.[langCode]?.[key] || customLang[key] || "";
			lang = replaceShortcutInLang(lang, prefix, commandName);
			for (let i = args.length - 1; i >= 0; i--)
				lang = lang.replace(new RegExp(`%${i + 1}`, "g"), args[i]);
			return lang || `❌ Can't find text on language "${langCode}" for ${commandType} "${commandName}" with key "${key}"`;
		};
	}
	return getText2;
}

module.exports = function (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) {
	return async function (event, message) {

		const { utils, client, GoatBot } = global;
		const { getPrefix, removeHomeDir, log, getTime } = utils;
		const { config, configCommands: { envGlobal, envCommands, envEvents } } = GoatBot;
		const { autoRefreshThreadInfoFirstTime } = config.database;
		let { hideNotiMessage = {} } = config;

		const { body, messageID, threadID, isGroup } = event;

		// Check if has threadID
		if (!threadID)
			return;

		const senderID = event.userID || ev
