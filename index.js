const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require("node-fetch");

function parseIssues(issues) {
  return issues.map(issue => {

    return {
      id: issue.number,
      title: issue.title,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      labels: issue.labels,
    }

  })
}

async function main() {
  try {

    // INPUT
    const token = core.getInput('token', { required: true });
    const functionsEndpoint = core.getInput('functions_endpoint', { required: true });
    const hostKey = core.getInput('host_key', { required: true });

    // INIT
    const octokit = new github.getOctokit(token);
    const { owner, repo } = github.context.repo
    const sendTelegramEndpoint = `${functionsEndpoint}/api/sendTelegram?code=${hostKey}&clientId=default`

    // PROCESS
    const response = await octokit.rest.issues.listForRepo({
      owner: owner,
      repo: repo,
      state: 'open',
    })

    const issues = parseIssues(response.data)
    const sendIssuesOptions = {
      method: "POST",
      body: issues,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    };

    const responseSendTelegram = await fetch(sendTelegramEndpoint, sendIssuesOptions)
    console.log(responseSendTelegram.data)

  } catch (error) {
    core.setFailed(error.message);
  }
}

main()