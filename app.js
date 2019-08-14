'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  session = require('client-sessions'),
  bodyParser = require('body-parser'),
  request = require('request'),
  app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // creates express http server


let page_token = process.env.page_token;

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

 //Set up session handler
app.use(session({
  cookieName: 'session',
  secret: '86i495c/)hy9ybyJ)6ek|883e3V[6%Dc`c~Skio*X|qZR6JYmOeI.=TuR>t`W^$',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.get('/', function(req, res) {
  res.send('Hi I am a chatbot\n');
});


let url = 'https://users.premierleague.com/accounts/login/'
let payload = {
 'password': "",
 'login': '',
 'redirect_uri': 'https://fantasy.premierleague.com/a/login',
 'app': 'plfpl-web'
}





// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      
      
      let x = 2
      let y = 5
      if (entry.messaging) {
        let messaging = entry.messaging[0];
        let sender_object = messaging.sender
        let sender = sender_object.id
        let message_text = messaging.message.text;
        sendText(sender, "Text echo: " + message_text)
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});


function sendText(sender, text) {
  let messageData = {text: text};
  request({
    url: "https://graph.facebook.com/v4.0/me/messages",
    qs: {access_token: page_token},
    method: "POST",
    json: {
      recipient: {id: sender}, 
      message: messageData
    }
  },
    function(error, response, body) {
      if (error) {
        console.log("sending error")
      } else if (response.body.error) {
        console.log("response body error")
      }
    }
  )
 }


// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "ants_token"

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
