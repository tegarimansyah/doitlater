import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Octokit } from '@octokit/rest'

interface Command {
    actionType: string,
    issueId: number
}

const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const owner = process.env.REPO_OWNER
const repo = process.env.REPO_NAME

const octokit = new Octokit({
    // Auth if used in github action https://github.com/octokit/auth-action.js
    auth: token,
});

async function commentIssue(issueId, msg) {
    const response = await octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueId,
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
            commentIssue(cmd.issueId, msg)
            await octokit.issues.setLabels({
                ...issue,
                label: 'todo'
            })
            break;
        case 'later':
            msg = 'Once again, this issue mark as later';
            commentIssue(cmd.issueId, msg)
            await octokit.issues.setLabels({
                ...issue,
                label: 'later'
            })
            break;
        case 'not-interested':
            msg = 'Closing this issue, since I no longer interested'
            commentIssue(cmd.issueId, msg)
            await octokit.issues.lock({
                ...issue,
                lock_reason: 'off-topic'
            })
            break;
        case 'done':
            msg = 'Finally done! 🎉🎉🎉'
            commentIssue(cmd.issueId, msg)
            await octokit.issues.lock({
                ...issue,
                lock_reason: 'resolved'
            })
            break;
    }

    commentIssue(
        cmd.issueId,
        msg
    )
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    context.log('HTTP trigger function processed a request.');
    const actionType = req.query.actionType
    const issueId = req.query.issueId

    await issueAction({
        actionType,
        issueId: parseInt(issueId)
    })

    const responseMessage = `Processing issue id #${issueId} to ${actionType}`;

    context.res = {
        // status: 200, /* Defaults to 200 */
        headers: {
            location: `https://github.com/${owner}/${repo}/issues/${issueId}`
        },
        body: responseMessage
    };

};

export default httpTrigger;