process.env["NTBA_FIX_319"] = 1; // to avoid a deprecation warning

require("dotenv").config();

const token = process.env.BOT_TOKEN;

const TelegramBot = require("node-telegram-bot-api");

// const helpMessage = require("./help");

// replace the value below with the Telegram token you receive from @BotFather

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp).catch((error) => {
        console.log(error.code); // => 'ETELEGRAM'
        console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
    });
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", (msg) => {});

console.log(`Bot is ready!`);
