const twitter = require('./twitterApi');
const {BotConfig, TweetStore} = require('./config');

let PARAMS = BotConfig.Load();
let tweetsForAction = TweetStore.Load();

async function SearchAndStore() {
  try {
    let { tweetIds, since_id } = await twitter.searchTweets(PARAMS);

    if (since_id) {
      PARAMS.since_id = since_id;
      
      BotConfig.Store(PARAMS );
      console.log('New since_id:', since_id);
    }

    if (tweetIds) {
      tweetsForAction = [...tweetsForAction, ...tweetIds];
      
      console.log(`Added ${tweetIds.length} tweets`);
    }
  } catch (e) {
    console.error(e);
  }
}

async function Action() {
  if (tweetsForAction.length) {
    let tweetId = tweetsForAction.shift();
    
    try {
      console.log('trying to retweet: ', tweetId)
      let res = await twitter.retweet(tweetId);
      
      console.log('Retweet successfull');
      
      // store ids to be able to survive crashes
      TweetStore.Store(tweetsForAction);
    } catch (e) {
      console.error(e);
    }
  }
}

// Run SearchAndStore after every 30 mins
setInterval(SearchAndStore, 30 * 60 * 1000);

// Run Action after every 5 mins
setInterval(Action, 5 * 60 * 1000);

// Start the first SearchAndStore
SearchAndStore();