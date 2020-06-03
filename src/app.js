const twitter = require('./twitterApi');

let PARAMS = {
  q: 'job developer join team',
  result_type: 'recent',
  count: 1
};

async function start() {
  try {
    let res = await twitter.searchTweets(PARAMS);
    
    console.log(res);
  } catch (e) {
    console.error(e);
  }
}

start();