const twitter = require('./twitterApi');

let PARAMS = {
  q: 'job developer join team',
  result_type: 'recent',
  count: 1
};

const search = async () => {
  try {
    let res = await twitter.searchTweets(PARAMS);
    
    console.log(res);
  } catch (e) {
    console.error(e);
  }
}

search();