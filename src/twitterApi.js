const Tw = require('twitter');
const {TwitterConfig} = require('./config');

const twitter = new Tw(TwitterConfig.acc);

async function searchTweets(search_params) {
  let endpoint = 'search/tweets';

  let res = await twitter.get(endpoint, search_params);

  let tweetIds = filterTweetIds(res.statuses);
  let since_id = getRefreshParameter(res.search_metadata);

  return {
    tweetIds,
    since_id
  };
}

async function retweet(tweetId) {
  let endpoint = `statuses/retweet`;

  let res = await twitter.post(endpoint, {
    id: tweetId
  });

  return res;
}

async function favorite(tweetId) {
  let endpoint = `favorites/create`;

  let res = await twitter.post(endpoint, {
    id: tweetId
  });

  return res;
}

function filterTweetIds(tweets) {
  let ids = [];

  tweets.forEach(tweet => {
    ids.push(tweet.id_str);
  })

  return ids;
}

function getRefreshParameter(search_metadata) {
  let since_id = '';

  let param = search_metadata.refresh_url;
  let start_index = param.indexOf('since_id=');

  // forward till after the '=' sign
  start_index += 9;

  // trim param before start_index
  param = param.slice(start_index, param.length);

  let end_index = param.indexOf('&');

  since_id = param.slice(0, end_index);

  return since_id;
}

module.exports = {
  searchTweets,
  favorite,
  retweet
};