var models = require('../models');
var bluebird = require('bluebird');



module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(function(messages){
        //construct response from messages
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(messages));
      });

    }, // a function which handles a get request for all messages
    post: function (req, res) {
      // models.post(something)

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
