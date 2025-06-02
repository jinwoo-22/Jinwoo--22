module.exports = function ({ globalGoat }) {
  const config = globalGoat.config;

  // ✅ Private Mode Checker
  const isAllowed = (uid) => {
    return !config.privateMode?.enable || config.privateMode.allowedUIDs.includes(uid);
  };

  return {
    // ✅ onChat: when a message is received
    async onChat({ message, event }) {
      if (!isAllowed(event.senderID)) return;
      console.log(`[CHAT] ${event.senderID}: ${message.body}`);
      // Place your command or message handler logic here
    },

    // ✅ onReaction: when someone reacts to a message
    async onReaction({ message, event }) {
      if (!isAllowed(event.senderID)) return;

      if (event.reaction === "😾") {
        try {
          await globalGoat.api.deleteMessage(event.messageID);
          console.log(`😾 Deleted message: ${event.messageID}`);
        } catch (err) {
          console.error("❌ Failed to delete message:", err);
        }
      }
    },

    // ✅ onReply: when someone replies to the bot
    async onReply({ message, event }) {
      if (!isAllowed(event.senderID)) return;
      console.log(`[REPLY] ${event.senderID}: ${message.body}`);
    },

    // ✅ onEvent: handles other events
    async onEvent({ message, event }) {
      if (!isAllowed(event.senderID)) return;
      console.log(`[EVENT] from ${event.senderID}`);
    },

    // ✅ handlerEvent: optional handler for supported events
    async handlerEvent({ message, event }) {
      if (!isAllowed(event.senderID)) return;
      console.log(`[handlerEvent] from ${event.senderID}`);
    },

    // ✅ Optional: presence, read receipt, and typing indicators
    async presence() {},
    async read_receipt() {},
    async typ() {},

    // ✅ Return all handlers
    return: {
      onChat: this.onChat,
      onReaction: this.onReaction,
      onReply: this.onReply,
      onEvent: this.onEvent,
      handlerEvent: this.handlerEvent,
      presence: this.presence,
      read_receipt: this.read_receipt,
      typ: this.typ
    }
  };
};
