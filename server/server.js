"use strict";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Imports dependencies and set up http server
const express = require("express"),
  session = require("client-sessions"),
  bodyParser = require("body-parser"),
  request = require("request"),
  cors = require("cors"),
  app = express();

var path = require("path");
var serveStatic = require("serve-static");
app.use(express.static(path.join(__dirname, '../client/dist')))
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // creates express http server

const players = require(__dirname + "/routes/api/players");
app.use('/api/players', players);

const webhook = require(__dirname + '/routes/api/webhook');
app.use('/api/webhook', webhook);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(__dirname));
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
    });
}
let port = process.env.PORT || 5000
// Sets server port and logs message on success
app.listen(port, () => console.log("webhook is listening at: " + port));

let session_secret = process.env.session_secret;
//Set up session handler
app.use(
  session({
    cookieName: "session",
    secret: session_secret,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
  })
);