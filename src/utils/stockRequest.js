const request = require('request');

const url = 'http://stockapp-env.eba-hffdiq4a.us-east-1.elasticbeanstalk.com/138930'

request(url, { json: true }, (err, res, body) => {

  if (err) { return console.log(err); }
  console.log(res.body);
//   console.log(body.explanation);
});