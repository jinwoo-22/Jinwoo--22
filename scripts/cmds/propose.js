module.exports = {
  config: {
    name: "propose",
    aliases: ["love", "💘"],
    version: "2.0",
    author: "GPT X SOJIB ⚡",
    countDown: 3,
    role: 0,
    shortDescription: "Propose someone romantically 💌",
    longDescription: "Send a sweet proposal message to your crush or partner 💖",
    category: "fun",
    guide: {
      en: "{pn} @mention — to propose someone"
    }
  },

  onStart: async function ({ message, event }) {
    const mention = Object.keys(event.mentions)[0];
    if (!mention) {
      return message.reply("💘 Please tag someone to propose!\n\nExample: propose @crush");
    }

    const name = event.mentions[mention].replace("@", "");
    const senderName = event.senderName;

    // Random proposals
    const proposals = [
      `🌹 ${senderName} kneels down and whispers to ${name}: "তোমার জন্য আমার হৃদয়টা আজও কাঁপে... হবে কি তুমি আমার জীবনের চিরসঙ্গী? 💍"`,
      `💖 ${senderName} says to ${name}: "তুমি না থাকলে জীবনটা কেমন ফাঁকা লাগে... প্লিজ, হবে কি আমার ভালোবাসা?" 💌`,
      `🥺 ${senderName} eyes locked with ${name}: "একটা সুযোগ দাও তোমার হাসির পেছনের কারণ হতে 🙏"`,
      `💘 ${senderName} holds a rose and says: "${name}, আমার জীবনের প্রতিটি মুহূর্ত শুধু তোমার জন্য" 🌸`,
      `🧿 ${senderName} to ${name}: "তোমায় প্রথম দেখা থেকেই হৃদয়টা কেমন যেন... তুমি রাজি থাকলে, আমি এখনই চাঁদে উড়ে যাই!" 🚀`,
      `💍 ${senderName} says: "এই জীবন যদি আরেকবার পেতাম, তাও শুধু তোমাকেই চাইতাম ${name}..." 😔❤️`
    ];

    // Randomize
    const reply = proposals[Math.floor(Math.random() * proposals.length)];

    message.reply({
      body: reply,
      mentions: [{ tag: name, id: mention }]
    });
  }
};
