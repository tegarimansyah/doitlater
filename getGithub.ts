const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  // Auth if used in github action https://github.com/octokit/auth-action.js
  auth: process.env.PERSONAL_TOKEN,
});

async function commentIssue(issueId) {
  const response = await octokit.issues.createComment({
    owner: 'tegarimansyah',
    repo: 'doitlater',
    issue_number: issueId,
    body: 'Test bikin issue dari api'
  })

  console.log(response)
}

function parseIssues(issues) {
  return issues.map(issue => {

    return {
      id: issue.number,
      title: issue.title,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      labels: issue.labels,
      body: issue.body
    }

  })
}

// Ref: https://octokit.github.io/rest.js/v18#issues-list-for-repo
async function getIssues() {

  const response = await octokit.issues.listForRepo({
    owner: 'tegarimansyah',
    repo: 'doitlater',
    state: 'open',
  })
  const issues = parseIssues(response.data)

  console.log({
    rateLimitRemaining: response.headers["x-ratelimit-remaining"]
  })
  console.log(issues)
}

getIssues()