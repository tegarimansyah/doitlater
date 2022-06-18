const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID

const bot = new TelegramBot(token, { polling: false })

const generateInlineKeyboard = (issueId) => [
          [
            {
              text: 'Mark as todo',
              url:  `https://google.com/?q=todo-${issueId}`
            },
            {
              text: 'Later (again)',
              url:  `https://google.com/?q=later-${issueId}`
            },
            {
              text: 'No longer interested',
              url:  `https://google.com/?q=not-interested-${issueId}`
            },
          ]
        ]

async function sendMessage({msg, issueId}) {
  await bot.sendMessage(
    chatId, 
    msg,
    {
      parse_mode: 'MarkdownV2',
      reply_markup: issueId && { inline_keyboard: generateInlineKeyboard(issueId) }
    }
  )
}

async function sendWeeklyMessage() {
  // await sendMessage({ msg: '====================\nHi Tegar, here are your weekly to do items to reviews' })
  await sendMessage({ msg: '[Tugas 1](http://www.example.com/)\n\nIni adalah sebuah deskripsi yang gak terlalu panjang', issueId: 1})
  // await sendMessage({ msg: 'Tugas 2', issueId: 2})
  // await sendMessage({ msg: 'Tugas 3', issueId: 3})
  // await sendMessage({ msg: 'Tugas 4', issueId: 4})
  // await sendMessage({ msg: 'Tugas 5', issueId: 5})
  // await sendMessage({ msg: 'End of your weekly task, Good luck!\n====================\n'})
}

sendWeeklyMessage()