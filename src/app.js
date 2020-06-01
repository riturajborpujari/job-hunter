const Tw = require('twitter');
const config = require('./config');

const twitter = new Tw(config.app_only);

console.log ('config:', config)

twitter.get('search/tweets', {
  q: 'job developer join team',
  result_type: 'recent', 
  count: 1
}).then(data => {
  console.log(data);
}).catch(err=> {
  console.error(err);
})