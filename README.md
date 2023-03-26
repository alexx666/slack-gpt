# `SlackGPT`

A slack integration for OpenAI's Chat GPT on AWS

## Features

- Responds to mentions
- Uses chat history
- Customizable system prompt on deployment

## Limitations

- API Gateway's `30` seconds response time => may cause timeouts if the prompt (including chat history) requires longer processing by Chat GPT
- No robust error handling
- Deployment may require manual actions => See `Considerations` section

# Getting Started

This section will guide you through the setup process

## Pre-requisites

- AWS account
- OpenAI account
- Slack account

# Deployment

This section will walk you through the deployment process

1. Create a Slackbot

> Follow the [link](https://api.slack.com/apps) in the official documentation for instructions. You can use the provided [App Manifest](cfn/slack.manifest.yml) to create the app instead of doing it from scratch, or use it as a reference for the manual configuration. However make sure you comment out / omit the `event_subscriptions` section untill AWS deployment is complete.

2. Install the app to your workspace
3. Generate authorization tokens
    
    - Generate a Slackbot token from `OAuth & Permissions` 
    - Create a ChatGPT token [here](https://platform.openai.com/account/api-keys)

5. Build & Deploy the project

```
npm run build -s
npm run deploy -s
```

6. Enable `event_subscriptions` for the bot using the `SlackRequestUrl` (see `Outputs` section after deployment) as `request_url`.

> Follow the instructions of AWS SAM and use your GPT and slack tokens to

## Considerations

After deployment some you need to perform the following manual changes on the created resources:

- Give the Http API gateway permissions to invoke lambda (done with AWS CLI)
- Enable TTL for `ttl` parameter of DynamoDB table