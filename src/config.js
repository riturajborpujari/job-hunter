const fs = require('fs');
require('dotenv').config();

/**
 * Internal configurations for the Bot
 *  - Stores the most recent tweet fetched for continuation
 *  - Stores the tweets not already retweeted
 */
var CONFIG = require('../config.json');

/**
 * Tokens and keys for configuring the twitter client
 */
const api_config = {
  application_level: {
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    bearer_token: process.env.bearer_token
  },
  account_level: {
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret
  }
};

/**
 * The username of the bot
 */
const bot_username = process.env.BOT_USERNAME;

/**
 * The interval(in milliseconds) to wait between retweets
 */
const tweet_interval = (process.env.TWEET_INTERVAL_IN_SEC) * 1000;


/**
 * The Search Parameters object
 * @exports @typedef {Object} SearchParams
 * @property {string} q                 the search string
 * @property {string} result_type       type of tweets to fetch ('recent' | 'mixed' | '')
 * @property {number} count             number of tweets to fetch in one API call
 * @property {string} since_id          the id of the newest tweet already fetched
 */


/**
 * Create the search parameters for twitter client
 * @type {SearchParams}       
 */
const params = {
  q: process.env.SEARCH_QUERY,
  result_type: 'recent',
  count: process.env.SEARCH_COUNT_PER_REQUEST,
  since_id: CONFIG.since_id
};


/**
 * Updates the id of the latest tweet used for search continuation
 * @param {string} since_id the id of the latest tweet fetched
 */
function UpdateContinuationParam(since_id) {
  /**
   * Modify in search parameters
   */
  params.since_id = since_id;

  /**
   * Update config file asynchronously
   */
  CONFIG.since_id = since_id;
  fs.writeFile('config.json', JSON.stringify(CONFIG), () => {});

  return params;
}

/**
 * The ids of tweets stored locally
 * @type {string[]}
 */
var tweet_ids = CONFIG.tweet_ids;

/**
 * Add new tweets to list
 * @param {string[]} ids the list of ids of tweets to add to list
 */
const AddNewTweets = (ids) => {
  /**
   * Merge new Tweets into older array
   */
  tweet_ids = [...ids, ...tweet_ids];

  /**
   * Update config file asynchronously
   */
  CONFIG.tweet_ids = tweet_ids;
  fs.writeFile('config.json', JSON.stringify(CONFIG), () => {});

  return tweet_ids;
}

/**
 * Get a tweet from the list
 */
const GetTweet = () => {
  /**
   * Pop the last tweet from list
   */
  const tweet_id = tweet_ids.pop();

  /**
   * Update config file asynchronously
   */
  CONFIG.tweet_ids = tweet_ids;
  fs.writeFile('config.json', JSON.stringify(CONFIG), () => {});

  return tweet_id;
}

const TweetStore = {
  tweet_ids,
  AddNewTweets,
  GetTweet,
  GetAllTweets : () => tweet_ids
};


module.exports = {
  api_config,
  bot: {
    username: bot_username,
    tweet_interval,
    params
  },
  TweetStore,
  UpdateContinuationParam
}