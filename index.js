const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

// ----------------------
// Slack App initialization
// ----------------------
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true
});

// ----------------------
// Helpers
// ----------------------
async function safeRespond(respond, text) {
  try {
    await respond({ text });
  } catch (err) {
    console.error("Respond error:", err);
  }
}

// ----------------------
// Commands
// ----------------------

// /asd-ping
app.command("/asd-ping", async ({ ack, respond }) => {
  await ack();
  return await safeRespond(respond, "Pong 🏓");
});

// ----------------------
// Sum
// ----------------------
app.command("/asd-sum", async ({ command, ack, respond }) => {
  await ack();

  const args = (command.text || "").trim().split(/\s+/);
  const num1 = Number(args[0]);
  const num2 = Number(args[1]);

  if (isNaN(num1) || isNaN(num2)) {
    return safeRespond(respond, "Usage: /asd-sum 5 10");
  }

  return safeRespond(respond, `Sum: ${num1 + num2}`);
});

// ----------------------
// Rectangle
// ----------------------
app.command("/asd-rect", async ({ command, ack, respond }) => {
  await ack();

  const args = (command.text || "").trim().split(/\s+/);
  const a = Number(args[0]);
  const b = Number(args[1]);

  if (isNaN(a) || isNaN(b)) {
    return safeRespond(respond, "Usage: /asd-rect 5 10");
  }

  return safeRespond(respond, `Area: ${a * b}`);
});

// ----------------------
// BMI
// ----------------------
app.command("/asd-bmi", async ({ command, ack, respond }) => {
  await ack();

  const args = (command.text || "").trim().split(/\s+/);
  const weight = Number(args[0]);
  const height = Number(args[1]);

  if (isNaN(weight) || isNaN(height) || height <= 0) {
    return safeRespond(respond, "Usage: /asd-bmi 70 175");
  }

  const bmi = weight / (height / 100) ** 2;
  return safeRespond(respond, `BMI: ${bmi.toFixed(2)}`);
});

// ----------------------
// Dice
// ----------------------
app.command("/asd-dice", async ({ ack, respond }) => {
  await ack();

  const dice = Math.floor(Math.random() * 6) + 1;
  return safeRespond(respond, `🎲 You rolled ${dice}`);
});

// ----------------------
// Cat fact
// ----------------------
app.command("/asd-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const res = await axios.get("https://catfact.ninja/fact", {
      timeout: 5000
    });

    const fact = res?.data?.fact;

    if (!fact) throw new Error("Invalid API response");

    return safeRespond(respond, `🐱 Cat Fact:\n${fact}`);
  } catch (err) {
    console.error(err);
    return safeRespond(respond, "Failed to fetch cat fact.");
  }
});

// ----------------------
// Bitcoin price
// ----------------------
app.command("/asd-bitcoin", async ({ ack, respond }) => {
  await ack();

  try {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      { timeout: 5000 }
    );

    const price = res?.data?.bitcoin?.usd;

    if (!price) throw new Error("Invalid API response");

    return safeRespond(respond, `₿ Bitcoin: $${price}`);
  } catch (err) {
    console.error(err);
    return safeRespond(respond, "Failed to fetch Bitcoin price.");
  }
});

// ----------------------
// Help
// ----------------------
app.command("/asd-help", async ({ ack, respond }) => {
  await ack();

  return safeRespond(
    respond,
    `Commands:
• /asd-ping - Pong
• /asd-sum - Sum number1 number2
• /asd-bmi - Calculate BMI
• /asd-dice - Roll dice
• /asd-catfact - Random cat fact
• /asd-bitcoin - Bitcoin price
• /asd-rect - Rectangle area
• /asd-help - Help`
  );
});

// ----------------------
// Start bot
// ----------------------
(async () => {
  try {
    await app.start();
    console.log("⚡ Slack bot is running (Socket Mode)");
  } catch (error) {
    console.error("Failed to start bot:", error);
  }
})();