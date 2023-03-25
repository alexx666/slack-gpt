# `SlackGPT`

A slack integration for chat GPT on AWS

## Deployment

Manual actions:

- Give Http API gateway permissions to invoke lambda (done with AWS CLI)
- Enable TTL for `ttl` parameter of DynamoDB table