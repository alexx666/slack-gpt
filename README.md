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

- An AWS account
- A slack account

# Deployment

This section will walk you through the deployment process

## AWS setup

> TODO

## Considerations

After deployment some you need to perform the following manual steps:

- Give the Http API gateway permissions to invoke lambda (done with AWS CLI)
- Enable TTL for `ttl` parameter of DynamoDB table