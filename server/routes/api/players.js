const express = require('express');
const router = express.Router();
const request = require("request");
router.get("/", function(req, res) {
    request(
      {
        url: "https://draft.premierleague.com/api/bootstrap-static",
        method: "GET"
      },
      function(error, response, body) {
        if (error) {
          error_message = "sending error: " + error;
          console.log(error_message);
          res.send(error_message);
        } else if (response.body.error) {
          error_message = "response body error: " + response.body.error;
          console.log(error_message);
          res.send(error_message);
        }
        let json_response = JSON.parse(body);
        let players = json_response["elements"];
        let id_to_team = {};
        let teams = json_response["teams"].forEach(function(team) {
          id_to_team[team["id"]] = team["name"];
        });
        players = players.map(function(player) {
          let id = player["team"];
          player["team"] = id_to_team[id];
          return player;
        });
        res.send(players);
      }
    );
});

module.exports = router;