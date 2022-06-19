const core = require('@actions/core');
const github = require('@actions/github');

async function main() {
  try {

    // INPUT
    const token = core.getInput('token', { required: true });
    const nameToGreet = core.getInput('who-to-greet');

    // INIT
    const octokit = new github.getOctokit(token);
    
    
    // PROCESS
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
  
    const {owner, repo} = github.context.repo
    const repoFullPath = `${owner}/${repo}`
  
    const issueList = await octokit.issues.listForRepo({
      owner: owner,
      repo: repo,
      state: 'open',
    })
  
    console.log(`The event payload: ${payload}`);
    console.log(`From repo path: ${repoFullPath}`)
    console.log(issueList)
  
  } catch (error) {
    core.setFailed(error.message);
  }
}

main()