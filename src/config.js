require('dotenv').config()

const twitter_conf = {
  app_only: {
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    bearer_token: process.env.bearer_token
  },
  acc: {
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret
  } 
}

module.exports = twitter_conf