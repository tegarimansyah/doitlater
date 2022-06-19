import { AzureFunction, Context, HttpRequest } from "@azure/functions"
const TelegramBot = require('node-telegram-bot-api');

// Add to Azure Function Application Settings
const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID

const functionsEndpoint = process.env.FUNCTIONS_ENDPOINT
const hostKey = process.env.HOST_KEY

// Constant variable
const responseIssueEndpoint = `${functionsEndpoint}/api/responseIssue?code=${hostKey}&clientId=default`
const bot = new TelegramBot(token, { polling: false })

interface Message {
    msg: string,
    issueId?: number
}

const generateInlineKeyboard = (issueId) => [
    [
        {
            text: 'Mark as todo 💪',
            url: `${responseIssueEndpoint}&actionType=todo&issueId=${issueId}`
        },
        {
            text: 'Later (again 😤)',
            url: `${responseIssueEndpoint}&actionType=later&issueId=${issueId}`
        },
        {
            text: 'No longer interested 🤯',
            url: `${responseIssueEndpoint}&actionType=not-interested&issueId=${issueId}`
        },
    ],
    [
        {
            text: 'Mark as Done 🎉',
            url: `${responseIssueEndpoint}&actionType=done&issueId=${issueId}`
        }
    ]
]

async function sendMessage({ msg, issueId }: Message) {
    await bot.sendMessage(
        chatId,
        msg,
        {
            parse_mode: 'Markdown',
            reply_markup: issueId && { inline_keyboard: generateInlineKeyboard(issueId) }
        }
    )
}

async function sendWeeklyMessage(messages: Message[]) {
    await sendMessage({ msg: 'Hi Tegar, here are your weekly to do items to reviews' })

    for (const msg of messages) {
        await sendMessage(msg)
    }

    await sendMessage({ msg: 'End of your weekly task, Good luck\!\n\n' })
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    context.log('HTTP trigger function processed a request to send telegram.');
    await sendWeeklyMessage(req.body)

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: "ok"
    };

};

export default httpTrigger;