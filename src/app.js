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
      const tweets = TweetStore.AddNewTweets(result.tweet_ids);
      console.log('Tweets: ', tweets);

      return tweets.length;
    }
  } catch (err) {
    console.error(err);
  }
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

const RunSearchOnSchedule = async () => {
  const num_tweets = await SearchAndStore();

  /**
   * Calculate the duration after which to start searching again
   *  Calculated as - 
   *    `number of tweets * duration between retweets`
   */
  const break_duration = num_tweets * bot.tweet_interval;

  /**
   * Start searching again after the break
   */
  setTimeout(SearchAndStore, break_duration);
}

const RunActionOnSchedule = async () => {
  /**
   * Set to run action after every tweet_interval milliseconds
   */
  setInterval(Action, bot.tweet_interval);

  /**
   * Start the first time immediately
   */
  Action();
}

async function StartSchedules() {
  RunSearchOnSchedule();

  RunActionOnSchedule();
}

StartSchedules();