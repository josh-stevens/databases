var database = require('../db');





module.exports = {
  messages: {
    get: function (cb) {
      var messages = {results:[]};
      var db = database.dbConnection();
      db.query("select username, msg_text, roomname, created_at from messages join users on messages.id_users = users.id join rooms on messages.id_rooms = rooms.id", function(err, results) {
        messages.results = results;
        cb(messages);
        db.end();
      });
    },
    post: function (message, cb) {
      var username = message['username'], roomname = message['roomname'], body = message['message'], userId;
      body = body.split("'").join("''");

      var db = database.dbConnection();

        // query user table to check if user exists
      module.exports.users.get(username, db, function(userResult) {
        if (userResult.length === 0) {
          // if no, insert user into table, and try to post again
          module.exports.users.post(username, db, function() {
            db.end();
            module.exports.messages.post(message, cb);
          })
        } else {
          // if yes, store user id in variable
          userId = userResult[0].id;
          // query rooms table to check if room exists
          module.exports.rooms.get(roomname, db, function(roomResult) {
            // if no, insert room into table, and try to post again
            if (roomResult.length === 0) {
              module.exports.rooms.post(roomname, db, function() {
                db.end();
                module.exports.messages.post(message, cb);
              })
            } else {
              // if yes, store room id in variable
              roomId = roomResult[0].id;
              // insert message into messages table
              console.log("insert query: ", "insert into messages (msg_text, id_rooms, id_users) values ('" + body + "'," + roomId + "," + userId + ")")
              db.query("insert into messages (msg_text, id_rooms, id_users) values ('" + body + "'," + roomId + "," + userId + ")", function(err, results) {
                db.query("select * from messages", function (err, data) { console.log("Table after post: ", data);
                  db.end();
                  cb();
                })
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
      db.query("select * from users where username='" + username + "'", function(err, results) {
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
      db.query("select * from rooms where roomname='" + roomname + "'", function(err, results) {
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
