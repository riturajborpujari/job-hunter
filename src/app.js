const twitter = require('./twitterApi');
const {BotConfig, TweetStore, TweetInterval} = require('./config');

let PARAMS = BotConfig.Load();
let tweetsForAction = TweetStore.Load();

async function SearchAndStore() {
  try {
    let { tweetIds, since_id } = await twitter.searchTweets(PARAMS);

    if (since_id) {
      PARAMS.since_id = since_id;
      
      // Save bot config to disk
      BotConfig.Store(PARAMS );
      console.log('New since_id:', since_id);
    }

    if (tweetIds) {
      // merge the newly loaded tweet ids with older ones
      // New ones will be in the front
      tweetsForAction = [...tweetIds, ...tweetsForAction];

      // save the tweets to disk
      TweetStore.Store(tweetsForAction);
      
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
      await twitter.retweet(tweetId);
      
      console.log('Retweeted on', new Date());    
    } catch (e) {
      console.error(e);
    }
    
    // store ids to be able to survive crashes
    TweetStore.Store(tweetsForAction);
  }
  else{
    console.log('No tweets in queue!', new Date());
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