const axios = require("axios");

require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/dsb-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/dsb-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Commands:
/dsb-ping - Pong
/dsb-sum - Sum number1 number2
/dsb-bmi - Calculate BMI
/dsb-dice - Rolling dice
/dsb-help - Help`
  });
});

app.command("/dsb-sum", async ({ command, ack, respond }) => {
  try {
    await ack();

    const args = command.text.trim().split(" ");

    const num1 = Number(args[0]);
    const num2 = Number(args[1]);

    if (isNaN(num1) || isNaN(num2)) {
      await respond({
        text: "Usage: /dsb-sum 5 10"
      });

      return;
    }

    const sum = num1 + num2;

    await respond({
      text: `Sum: ${sum}`
    });

  } catch (error) {
    console.error(error);
  }
});

app.command("/dsb-bmi", async ({ command, ack, respond }) => {
  try {
    await ack();

    const args = command.text.trim().split(" ");

    const num1 = Number(args[0]);
    const num2 = Number(args[1]);

    if (isNaN(num1) || isNaN(num2)) {
      await respond({
        text: "Usage: /dsb-bmi 70 175"
      });

      return;
    }

    const bmi = num1 / (num2 / 100) ** 2;

    await respond({
      text: `BMI: ${bmi.toFixed(2)}`
    });

  } catch (error) {
    console.error(error);
  }
});

app.command("/dsb-dice", async ({ ack, respond }) => {
    await ack();
    const dice = Math.floor(Math.random() * 6) + 1;
    await respond(`You rolled ${dice}`);
});

app.command("/dsb-ping", async ({ ack, respond }) => {
    await ack();
    await respond(`Pong`);
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();