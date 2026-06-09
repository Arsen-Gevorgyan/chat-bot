const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});


app.command("/asd-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact", {
      timeout: 5000
    });

    return await respond({
      text: `🐱 Cat Fact:\n${response.data.fact}`
    });

  } catch (err) {
    console.error(err);
    return await respond({
      text: "Failed to fetch a cat fact."
    });
  }
});

app.command("/asd-bitcoin", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      {
        timeout: 5000
      }
    );

    const price = response.data.bitcoin.usd;

    return await respond({
      text: `₿ Bitcoin price: $${price}`
    });

  } catch (err) {
    console.error(err);

    return await respond({
      text: "Failed to fetch Bitcoin price."
    });
  }
});

app.command("/asd-help", async ({ ack, respond }) => {
  await ack();

  return await respond({
    text:
`Commands:
• /asd-ping - Pong
• /asd-sum - Sum number1 number2
• /asd-bmi - Calculate BMI
• /asd-dice - Roll dice
• /asd-catfact - Random cat fact
• /asd-bitcoin - Bitcoin price
• /asd-rect - Calculate Rectangle area
• /asd-help - Help`
  });
});

app.command("/asd-sum", async ({ command, ack, respond }) => {
  await ack();

  try {
    const args = (command.text || "").trim().split(/\s+/);

    const num1 = Number(args[0]);
    const num2 = Number(args[1]);

    if (isNaN(num1) || isNaN(num2)) {
      return await respond({
        text: "Usage: /asd-sum 5 10"
      });
    }

    return await respond({
      text: `Sum: ${num1 + num2}`
    });

  } catch (error) {
    console.error(error);
    return await respond({
      text: "Error occurred in /asd-sum"
    });
  }
});

app.command("/asd-rect", async ({ command, ack, respond }) => {
  await ack();

  try {
    const args = (command.text || "").trim().split(/\s+/);

    const num1 = Number(args[0]);
    const num2 = Number(args[1]);

    if (isNaN(num1) || isNaN(num2)) {
      return await respond({
        text: "Usage: /asd-rect 5 10"
      });
    }

    return await respond({
      text: `Area: ${num1 * num2}`
    });

  } catch (error) {
    console.error(error);
    return await respond({
      text: "Error occurred in /asd-rect"
    });
  }
});



app.command("/asd-bmi", async ({ command, ack, respond }) => {
  await ack();

  try {
    const args = (command.text || "").trim().split(/\s+/);

    const weight = Number(args[0]);
    const height = Number(args[1]);

    if (isNaN(weight) || isNaN(height) || height <= 0) {
      return await respond({
        text: "Usage: /asd-bmi 70 175"
      });
    }

    const bmi = weight / (height / 100) ** 2;

    return await respond({
      text: `BMI: ${bmi.toFixed(2)}`
    });

  } catch (error) {
    console.error(error);
    return await respond({
      text: "Error occurred in /asd-bmi"
    });
  }
});


app.command("/asd-dice", async ({ ack, respond }) => {
  await ack();

  try {
    const dice = Math.floor(Math.random() * 6) + 1;

    return await respond({
      text: `🎲 You rolled ${dice}`
    });

  } catch (error) {
    console.error(error);
    return await respond({
      text: "Error rolling dice."
    });
  }
});


app.command("/asd-ping", async ({ ack, respond }) => {
  await ack();

  return await respond({
    text: "Pong 🏓"
  });
});
(async () => {
  try {
    await app.start(3000);
    console.log("⚡ Slack bot is running on port 3000");
  } catch (error) {
    console.error("Failed to start bot:", error);
  }
})();