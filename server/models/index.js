var database = require('../db');





module.exports = {
  messages: {
    get: function (cb) {
      var messages = {results:[]};
      var db = database.dbConnection();
      db.query("select * from messages", function(err, results) {
        messages.results = results;
        cb(messages);
        db.end();
      });
    },
    post: function (message, cb) {
      var username = message['username'], roomname = message['roomname'], body = message['text'], userId;

      var db = database.dbConnection();

        // query user table to check if user exists
      module.exports.users.get(username, db, function(result) {
        console.log(result);
        if (!result) {
          // if no, insert user into table, and try to post again
          module.exports.users.post(username, db, function() {
            db.end();
            module.exports.messages.post(message);
          })
        } else {
          // if yes, store user id in variable
          userId = result[0].id;
          // query rooms table to check if room exists
          module.exports.rooms.get(roomname, db, function(result) {
            // if no, insert room into table, and try to post again
            if (!result) {
              module.exports.users.post(username, db, function() {
                db.end();
                module.exports.messages.post(message);
              })
            } else {
              // if yes, store room id in variable
              roomId = result[0].id;
              // insert message into messages table
              db.query("insert into messages (msg_text, id_rooms, id_user) values ('" + body + "'," + roomId + "," + userId + ")", function(err, results) {
                cb();
                db.end();
              });
            }
          })
        }
      })
    }
  },

  users: {
    // Ditto as above.
    get: function (username, db, cb) {
      db.query("select * from users where username=" + username, function(err, results) {
        cb(results);
      });
    },
    post: function (username, db, cb) {
      db.query("insert into users (username) values('" + username + "')", function(err, results) {
        if (err) console.log(err);
        cb();
      });
    }
  },

  rooms: {
    get: function(roomname, db, cb) {
      db.query("select * from rooms where roomname=" + roomname, function(err, results) {
        cb(results);
      });
    },
    post: function(roomname, db, cb) {
      db.query("insert into rooms (roomname) values('" + roomname + "')", function(err, results) {
        cb();
      });
    }
  }
};

module.exports.messages.post({'username': 'fakeUser', 'text': 'Testing!', 'roomname' : 'makersquare' }, function(){console.log('done')});
