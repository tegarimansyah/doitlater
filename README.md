# Do It Later (Via Github Issue)

## Structure

First of all, we have do it later github action in 2 file:

* [`action.yml`](action.yml)
* [`index.js`](index.js)

It will get all issues, get N `num_issues`, compose the message from the data and send it to telegram via `sendTelegram` Azure Functions. The example how to use it in [`.github/workflows/get-issues-weekly.yml`](.github/workflows/get-issues-weekly.yml)

We have 3 functions (deployed to Azure Functions)

* **sendTelegram**<br>
  Receive list of issues from github action, get image from Azure Blob, send it to telegram and (TODO) send it to `createAnalytics` function via cosmos db trigger
* **createAnalytics** (In Progress)<br>
  Analyze previous and current data to create a graph that show us our progress
* **responseIssue**<br>
  Receive data from telegram button and do some action (comment, add label or close an issue), depends on user action.

## Microsoft Technology That We Use:

* Github + Github Action
* Visual Studio Code
  * Azure Function extensions
  * Azure Storage extensions
* Azure Functions
* Azure Blob
* Azure Cosmos DB (TODO)
* Typescript
## Set Up Your Azure Infrastructure (TODO)

* Clone this repo
* Open with Visual Studio Code and install two extensions:
  * Azure Function
  * Azure Sign In
* Create Function in Azure
* Right Click, deploy to function
* Copy Host Key
* Set Up Github Action