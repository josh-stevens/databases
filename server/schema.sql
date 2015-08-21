\u chat

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(20),
  PRIMARY KEY (id)
);

CREATE TABLE rooms (
  id INT NOT NULL AUTO_INCREMENT,
  roomname VARCHAR(20),
  PRIMARY KEY (id)
);

CREATE TABLE messages (
  id INT NOT NULL AUTO_INCREMENT,
  msg_text TEXT,
  created_at TIMESTAMP,
  id_rooms INT,
  id_users INT,
  PRIMARY KEY (id),
  FOREIGN KEY (id_rooms) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (id_users) REFERENCES users(id) ON DELETE CASCADE
);

/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

