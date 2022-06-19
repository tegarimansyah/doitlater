import { AzureFunction, Context, HttpRequest } from "@azure/functions"
const { Octokit } = require("@octokit/rest");

interface Command {
    actionType: string,
    issueId: number
}

interface IssueData {
    owner: string,
    repo: string,
    issue_number: number
}

const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || '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';
const owner = process.env.REPO_OWNER || 'tegarimansyah';
const repo = process.env.REPO_NAME || 'doitlater';

const octokit = new Octokit({
    // Auth if used in github action https://github.com/octokit/auth-action.js
    auth: token,
});

async function commentIssue(issueData: IssueData, msg: string) {
    const response = await octokit.issues.createComment({
        ...issueData,
        body: msg
    })
}

async function issueAction(cmd: Command) {
    let msg = '';
    const issue = {
        owner,
        repo,
        issue_number: cmd.issueId,
    }
    await octokit.issues.removeAllLabels({
        ...issue
    })

    switch (cmd.actionType) {
        case 'todo':
            msg = 'This issue mark as to do';
            commentIssue(issue, msg)
            await octokit.issues.setLabels({
                ...issue,
                labels: ['todo']
            })
            break;
        case 'later':
            msg = 'Once again, this issue mark as later';
            commentIssue(issue, msg)
            await octokit.issues.setLabels({
                ...issue,
                labels: ['later']
            })
            break;
        case 'not-interested':
            msg = 'Closing this issue, since I no longer interested'
            commentIssue(issue, msg)
            await octokit.issues.lock({
                ...issue,
                lock_reason: 'off-topic'
            })
            await octokit.issues.update({
                ...issue,
                state: 'closed'
            })
            break;
        case 'done':
            msg = 'Finally done! 🎉🎉🎉'
            commentIssue(issue, msg)
            await octokit.issues.lock({
                ...issue,
                lock_reason: 'resolved'
            })
            await octokit.issues.update({
                ...issue,
                state: 'closed'
            })
            break;
    }

}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    try {
        context.log('HTTP trigger function processed a request.');
        const actionType = req.query.actionType
        const issueId = req.query.issueId

        await issueAction({
            actionType,
            issueId: parseInt(issueId)
        })

        const responseMessage = `Processing issue id #${issueId} to ${actionType}`;

        context.res = {
            status: 303,
            headers: {
                location: `https://github.com/${owner}/${repo}/issues/${issueId}`
            },
            body: responseMessage
        };
    } catch (error) {
        console.log(error)
    }

};

export default httpTrigger;