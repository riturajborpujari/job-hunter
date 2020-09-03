const Tw = require('twitter');
const { api_config, bot } = require('./config');

/**
 * Initialize the Twitter API client
 */
const twitter = new Tw(api_config.account_level);

/**
 * Searches for tweet
 * @param {import('./config').SearchParams} search_params the search parameters for Twitter
 */
async function SearchTweets(search_params) {
  const endpoint = 'search/tweets';

  const res = await twitter.get(endpoint, search_params);

  /**
   * Get the ids of the fetched tweets
   */
  let tweet_ids = GetTweetIds(res.statuses);

  /**
   * Get the new search continuation parameter
   */
  let since_id = getRefreshParameter(res.search_metadata);

  return {
    tweet_ids,
    since_id
  };
}

/**
 * Create a new retweet
 * @param {string} tweet_id the id of the tweet to retweet
 */
async function CreateRetweet(tweet_id) {
  const endpoint = `statuses/retweet`;

  const res = await twitter.post(endpoint, { id: tweet_id });

  return res;
}

/**
 * Favorite (like) a tweet
 * @param {string} tweet_id the id of the tweet to favorite (like)
 */
async function CreateFavorite(tweet_id) {
  const endpoint = `favorites/create`;

  const res = await twitter.post(endpoint, { id: tweet_id });

  return res;
}

function GetTweetIds(tweets) {
  /**
   * @type {string[]} the list of ids of tweets
   */
  const ids = [];

  tweets.forEach(tweet => {
    /**
     * Skip tweets that are posted by this bot itself
     */
    if (tweet.user.screen_name !== bot.username) {
      ids.push(tweet.id_str);
      // console.log(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
    }
  })

  return ids;
}

/*
  Find out since_id from search_metadata

  Structure:
    search_metadata : {
      refresh_url: 'since_id=212141434324341&q=job+developer&count=6'
      ...
    }

  Procedure: 
    1. Start with the refresh url.
    2. Find the index of the first character after '=' sign in 'since_id='
    3. Trim everything before this character(including the '=')
    4. Find the first occurence of '&' which will mark the end of since_id value
    5. slice from start to this end index
*/
function getRefreshParameter(search_metadata) {
  let since_id = '';

  let param = search_metadata.refresh_url;

  // length of 'since_id=' is 9
  let start_index = param.indexOf('since_id=') + 9;

  param = param.slice(start_index, param.length);
  let end_index = param.indexOf('&');

  since_id = param.slice(0, end_index);

  return since_id;
}

module.exports = {
  SearchTweets,
  CreateFavorite,
  CreateRetweet
};