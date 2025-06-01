module.exports = {
  config: {
    name: "lyrics",
    aliases: ["lyric", "songline"],
    version: "1.2",
    author: "GPT X SOJIB ⚡",
    countDown: 2,
    role: 0,
    shortDescription: "Get a random lyric line",
    longDescription: "Sends a random song lyric from a curated list",
    category: "fun",
    guide: {
      en: "{pn} — get a random lyric line"
    }
  },

  onStart: async function ({ message }) {
    const lyrics = [
      "🎵 Ab toh aadat si hai mujhko aese jeene mein",
      "🎶 Heyy-heyy, oo, oo, aah, aah, oo",
      "🔁 Palat! Tera Dhyaan Kidhar Hai, Yeh Tera Hero Idhar Hai",
      "📢 Tujhe Itni Bhi Khabar Hai Ke Tera Hero Idhar Hai",
      "🌌 আমি আকাশ পাঠাবো তোমার মনের আকাশে",
      "🎤 যেখানে গাইবে তুমি আনমনে",
      "🍃 খোলা মাঠে গাইবে গান বসন্তের বাতাসে",
      "❤️‍🔥 আমার বেঁচে থাকার প্রার্থনাতে, বৃদ্ধ হতে চাই তোমার সাথে",
      "💘 অনেক খুজে তোমায় নিলাম চিনে, ভালোবাসার এই দিনে",
      "💭 যদি আবার, দেখা হয় তোমার আমার, ভুলে যেও সব অভিমান",
      "💎 ছিলো যতো ঝণ, আছি আজো, আমি শুধুই তোমার",
      "🌀 জানি তুমি অন্য কারো, আমি দিশাহীন",
      "💔 ভালোবাসি বলে দাও আমায়",
      "📜 বলে দাও হ্যাঁ সব কবুল",
      "🔒 তুমি শুধু আমারই হবে যদি করো মিষ্টি এই ভুল",
      "🤝 হাতে হাত রাখতে পারো, সন্ধি আঙুলে আঙুল",
      "🎇 ভালোবাসা বাড়াতে আরও, হৃদয় ভীষণ ব্যাকুল"
    ];

    const randomLine = lyrics[Math.floor(Math.random() * lyrics.length)];
    return message.reply(randomLine);
  }
};
