const fs = require('fs');

require('dotenv').config()

const TwitterConfig= {
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

const Load = () => {
  let content = fs.readFileSync('botConfig.json');
  
  content = JSON.parse(content );
  
  return content;
}

const Store = (data) => {
  data = JSON.stringify(data);
  
  fs.writeFileSync('botConfig.json', data);
}

const LoadTweetIds = () => {
  let content = fs.readFileSync('tweetStore.json');
  
  content = JSON.parse(content);
  
  return content.ids;
}

const StoreTweetIds = (tweetIds) => {
  let data = {
    ids: tweetIds
  }
  
  data = JSON.stringify(data);
  
  fs.writeFileSync('tweetStore.json', data);
}


module.exports = {
  TwitterConfig, 
  BotConfig: {
    Load, 
    Store
  }, 
  TweetStore: {
    Load: LoadTweetIds, 
    Store: StoreTweetIds
  }
} 