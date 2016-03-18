module.exports = {
  //sql command for user table
  createUsersTable: 'CREATE TABLE IF NOT EXISTS Users' +
    '(' +
    'id SERIAL NOT NULL PRIMARY KEY,' +
    'username VARCHAR(255),' +
    'albums varchar(400) [],' +
    // 'email VARCHAR(255) NOT NULL,' +
    // "photo varchar(455) DEFAULT 'https://d30y9cdsu7xlg0.cloudfront.net/png/2958-200.png'," +
    'password varchar(455)' +
    ')',

  //sql command for album table
  createAlbumsTable: 'CREATE TABLE IF NOT EXISTS Albums' +
    '(' +
    'id SERIAL NOT NULL PRIMARY KEY,' +
    'name VARCHAR(255),' +
    'tag VARCHAR(255),' +
    "albumImage varchar(255) DEFAULT 'http://lh4.ggpht.com/iEyogFzb2gMbVBLSjgPL0qSETW76pRG1hQYRjLOnmU4JDgMdc65v53OZ3WWSvuRO_kY'," +
    'images varchar(255) [],' +
    'userid int references Users(id)' +
    ')',

 createImagesTable: 'CREATE TABLE IF NOT EXISTS Images' +
  '(' +
  'id SERIAL NOT NULL PRIMARY KEY,' +
  'username VARCHAR(255),' +
  "image varchar(255) DEFAULT 'http://lh4.ggpht.com/iEyogFzb2gMbVBLSjgPL0qSETW76pRG1hQYRjLOnmU4JDgMdc65v53OZ3WWSvuRO_kY'," +
  'tags varchar(255) [],' +
  'likes int,' +
  'comments varchar(255) [],' +
  'timeStamp varchar(25),' +
  'timeData int,' +
  'sourceURL varchar(255),' +
  'albumid int references Albums(id)' +
  ')',


    //photos
    //username
    //native link
    //play vdeos
}