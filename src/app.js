const twitter = require('./twitterApi');

let PARAMS = {
  q: 'job developer join team',
  result_type: 'recent',
  count: 1
};

twitter.searchTweets(PARAMS)
 .then(res => {
   console.log (res);
 })
 .catch(e => {
   console.error(e);
 })