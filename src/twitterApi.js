const Tw = require('twitter');
const { TwitterConfig, BotUser} = require('./config');

const twitter = new Tw(TwitterConfig.acc);

async function searchTweets(search_params) {
  let endpoint = 'search/tweets';

  let res = await twitter.get(endpoint, search_params);

  // Filter only ids for tweets
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
    if (BotUser) {
      // skip tweets that are posted by this bot itself
      if (tweet.user.screen_name !== BotUser) {
        ids.push(tweet.id_str);
      }
    }
    else {
      ids.push(tweet.id_str);
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
  searchTweets,
  favorite,
  retweet
};