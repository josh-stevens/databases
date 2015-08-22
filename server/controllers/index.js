var models = require('../models');
var bluebird = require('bluebird');



module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(function(messages){
        //construct response from messages

        res.status(200).append('Content-Type', 'application/json');
        res.send(JSON.stringify(messages));
      });

    },
    post: function (req, res) {
      // models.post(something)
      models.messages.post(req.body, function() {
        res.status(201);

        res.send();
      })

    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {}
  },

  rooms: {
    get: function(req, res) {},
    post: function(req, res) {}
  }
};
