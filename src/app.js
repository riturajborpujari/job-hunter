const twitter = require('./twitterApi');
const { bot, UpdateContinuationParam, TweetStore } = require('./config');

var PARAMS = bot.params;

async function SearchAndStore() {
  try {
    let result = await twitter.SearchTweets(PARAMS);

    if (result.since_id) {
      /**
       * Update search continuation parameter
       */
      PARAMS = UpdateContinuationParam(result.since_id);
      console.log('since_id: ', result.since_id);
    }

    if (result.tweet_ids.length) {
      /**
       * Add newly fetched tweets to list
       */
      tweet_ids =  TweetStore.AddNewTweets(result.tweet_ids);
      console.log('Tweets: ', TweetStore.GetAllTweets());
    }
  } catch (err) {
    console.error(err);
  }

  // // calculate the time after which queue will be empty
  // let interval = tweetsForAction.length * TweetInterval;
  // if (interval === 0) {
  //   interval = 1 * TweetInterval;
  // }
  // setTimeout(SearchAndStore, interval);
}

async function Action() {
  const tweet_id = TweetStore.GetTweet();
  
  if (tweet_id) {
    try {
      console.log(`Favoriting ${tweet_id}...`);
      await twitter.CreateFavorite(tweet_id);

      console.log(`Retweeting ${tweet_id}...`)
      await twitter.CreateRetweet(tweet_id);

      console.log('Done at ', new Date().toString());
    } catch (e) {
      console.error(e);
    }
  }
  else {
    console.log('No tweets in queue! ', new Date().toString());
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

SearchAndStore();