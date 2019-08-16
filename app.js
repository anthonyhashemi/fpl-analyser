"use strict";

// Imports dependencies and set up http server
const express = require("express"),
  session = require("client-sessions"),
  bodyParser = require("body-parser"),
  request = require("request"),
  app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // creates express http server

let page_token = process.env.page_token;

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

let session_secret = process.env.session_secret;
//Set up session handler
app.use(
  session({
    cookieName: "session",
    secret: session_secret,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  })
);

app.get("/", function(req, res) {
  res.send("Hi I am a chatbot\n");
});

// Creates the endpoint for our webhook
app.post("/webhook", (req, res) => {
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === "page") {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      if (entry.messaging) {
        let messaging = entry.messaging[0];
        let sender = messaging.sender.id;
        let message = messaging.message.text;
        // let comparison_substring = message.split("Compare")[1];
        // if (comparison_substring) {
        //   players = comparison_substring.join(" ");
        //   players_data = {};
        //   players.forEach(function(player) {
        //     player_data = get_player_stats(player, ["xG"]);
        //     players_data[player] = player_data;
        //   });
        //   return_message = players_data;
        // }
        try {
          let player = message;
          send_player_info(sender, player);
        } catch {
          if (message === "All players") {
            send_all_players_list(sender);
          } else {
            let text =
              "Sorry, I didn't get that.\nOptions:\n'<Player Name>':This will return all info on that player.\n'All players'\nThis will give you a list of all players in FPL";
            sendText(sender, text);
          }
        }
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

function send_player_info(recipient, desired_player) {
  request(
    {
      url: "https://draft.premierleague.com/api/bootstrap-static",
      method: "GET",
    },
    function(error, response, body) {
      if (error) {
        console.log("sending error: " + error);
      } else if (response.body.error) {
        console.log("response body error: " + response.body.error);
      }
      let json_response = JSON.parse(body);
      let all_players = json_response["elements"];
      for (let i = 0; i < all_players.length; i++) {
        let player = all_players[i];
        if (player["web_name"] === desired_player) {
          player_info = player;
          let player_info = [desired_player];
          for (var key in player) {
            if (player.hasOwnProperty(key)) {
              player_info.push(key + ": " + player[key]);
            }
          }
          let return_message = player_info.join("\n");
          sendText(recipient, return_message);
          break;
        }
      }
    }
  );
}

function send_all_players_list(recipient) {
  request(
    {
      url: "https://draft.premierleague.com/api/bootstrap-static",
      method: "GET",
    },
    function(error, response, body) {
      if (error) {
        console.log("sending error: " + error);
      } else if (response.body.error) {
        console.log("response body error: " + response.body.error);
      }
      let json_response = JSON.parse(body);
      let all_players = json_response["elements"];
      let players_points = [];
      all_players.forEach(function(player) {
        players_points.push([
          player["web_name"] + ": " + player["total_points"] + " points",
        ]);
      });
      let return_message = players_points.slice(1, 100).join("\n");
      sendText(recipient, return_message);
    }
  );
}

function sendText(recipient, text) {
  let messageData = { text: text };
  request(
    {
      url: "https://graph.facebook.com/v4.0/me/messages",
      qs: { access_token: page_token },
      method: "POST",
      json: {
        recipient: { id: recipient },
        message: messageData,
      },
    },
    function(error, response, body) {
      if (error) {
        console.log("sending error");
      } else if (response.body.error) {
        console.log("response body error");
      }
    }
  );
}

// Adds support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.verify_token;

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
