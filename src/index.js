process.env["NTBA_FIX_319"] = 1; // to avoid a deprecation warning

require("dotenv").config();

const token = process.env.BOT_TOKEN;

const TelegramBot = require("node-telegram-bot-api");

const helpMessage = require("./help");

const links = require("./links");

// console.log(helpMessage);

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

bot.on("new_chat_members", (msg) => {
    console.log(`user joined`);
    console.log(msg);
    const chatId = msg.chat.id;

    if (!msg.new_chat_member.is_bot) {
        bot.sendMessage(msg.new_chat_member.id, links).catch((error) => {
            console.log(error.code); // => 'ETELEGRAM'
            console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
        });
    }

    bot.sendMessage(chatId, `Hey @${msg.new_chat_member.username}, welcome!`).catch((error) => {
        console.log(error.code); // => 'ETELEGRAM'
        console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
    });
});

bot.on("left_chat_member", (msg) => {
    console.log(`member left`);
    console.log(msg.left_chat_member);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", (msg) => {
    if (msg.text == null || msg.text == undefined) {
        // console.log(`message text not defined`);
        return;
    }

    const chatId = msg.chat.id;
    const userQuestion = msg.text.replace(/\//, "");

    console.log(msg);

    const regExhelp = /^((h|H)(elp|ELP))/;

    if (regExhelp.test(userQuestion)) {
        console.log(`User ${msg.from.username}: ${userQuestion}`);

        bot.sendMessage(chatId, helpMessage).catch((error) => {
            console.log(error.code); // => 'ETELEGRAM'
            console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
        });
    } else {
        bot.sendMessage(chatId, links).catch((error) => {
            console.log(error.code); // => 'ETELEGRAM'
            console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
        });
    }
});

bot.on("polling_error", (error) => {
    console.log(error); // => 'EFATAL'
});

console.log(`Bot is ready!`);
