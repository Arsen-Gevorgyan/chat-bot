const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false
});

// CAT FACT
app.command("/asd-catfact", async ({ ack, respond }) => {
  await ack();

  const res = await axios.get("https://catfact.ninja/fact");
  return respond(`🐱 ${res.data.fact}`);
});

// BITCOIN
app.command("/asd-bitcoin", async ({ ack, respond }) => {
  await ack();

  const res = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
  );

  return respond(`₿ $${res.data.bitcoin.usd}`);
});

// PING
app.command("/asd-ping", async ({ ack, respond }) => {
  await ack();
  return respond("Pong 🏓");
});

// SUM
app.command("/asd-sum", async ({ ack, command, respond }) => {
  await ack();

  const [a, b] = (command.text || "").split(" ");
  const x = Number(a);
  const y = Number(b);

  if (isNaN(x) || isNaN(y)) return respond("Usage: /asd-sum 5 10");

  return respond(`Sum: ${x + y}`);
});

// BMI
app.command("/asd-bmi", async ({ ack, command, respond }) => {
  await ack();

  const [w, h] = (command.text || "").split(" ");
  const weight = Number(w);
  const height = Number(h);

  if (!weight || !height) return respond("Usage: /asd-bmi 70 175");

  const bmi = weight / (height / 100) ** 2;
  return respond(`BMI: ${bmi.toFixed(2)}`);
});

// RECTANGLE
app.command("/asd-rect", async ({ ack, command, respond }) => {
  await ack();

  const [a, b] = (command.text || "").split(" ");
  return respond(`Area: ${Number(a) * Number(b)}`);
});

// DICE
app.command("/asd-dice", async ({ ack, respond }) => {
  await ack();

  const dice = Math.floor(Math.random() * 6) + 1;
  return respond(`🎲 ${dice}`);
});

// HELP
app.command("/asd-help", async ({ ack, respond }) => {
  await ack();

  return respond(`
Commands:
/asd-ping
/asd-sum 5 10
/asd-bmi 70 175
/asd-rect 5 10
/asd-dice
/asd-catfact
/asd-bitcoin
`);
});

// PUBLIC SERVER START
(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡ ALWAYS-ON BOT RUNNING ON PORT ${port}`);
})();