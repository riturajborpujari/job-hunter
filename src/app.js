const twitter = require('./twitterApi');
const {BotConfig, TweetStore, TweetInterval} = require('./config');

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
      tweetsForAction = [...tweetIds, ...tweetsForAction];
      
      console.log(`Added ${tweetIds.length} tweets`);
    }
  } catch (e) {
    console.error(e);
  }
  
  // calculate the time after which queue will be empty
  let interval = tweetsForAction.length * TweetInterval;
  if (interval === 0){
    interval = 1 * TweetInterval;
  }
  setTimeout(SearchAndStore, interval);
}

async function Action() {
  if (tweetsForAction.length) {
    let tweetId = tweetsForAction.pop();
    
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


async function start() {
  // search for tweets
  await SearchAndStore();
  
  // Run Action after every TweetInterval milliseconds 
  setInterval(Action, TweetInterval);
  
  // also start retweeting immediately 
  Action();
}

start();