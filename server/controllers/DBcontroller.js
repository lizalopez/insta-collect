var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost/instacollect';
var Promise = require('bluebird');
var request = require('request');
var keys = require('../env/keys');
// var _ = require('lodash')

var imagesInDBToAddToAlbum = [];
var currentAlbumToSave = {};


module.exports = {
  saveImages: function(req, res) {
    var client = new pg.Client(connectionString);
    var albumId;
    client.connect();
    var collection = req.body.images;
    var queriesCompleted = [];
    collection.forEach(function(item) {
      var insertImageQuery = client.query("INSERT INTO Images (username, image, likes, timeStamp, sourceURL, albumid) VALUES ('"+item.username+"','"+item.image+"','"+item.likes+"','"+item.timeStamp+"','"+item.sourceURL+"','"+currentAlbumToSave.albumId+"') RETURNING ID;");
      insertImageQuery.on('end', function(data) {
        queriesCompleted.push(data);
      });
    });  
    Promise.all(queriesCompleted).then(function(data) {
      res.status(201).json(data);
    });
  },


  createAlbum: function(req, res, next) {
  var client = new pg.Client(connectionString);
  client.connect();
  var album = {
    name: req.body.name,
    tag: req.body.tag,
    albumImage: req.body.albumImage
  }
  // console.log('ALBUM TO CREATE >>>> ', album);
  var createAlbumQuery = client.query("INSERT INTO Albums (name, tag, albumImage) VALUES ('"+album.name+"','"+album.tag+"','"+album.albumImage+"') RETURNING ID;", function(err, data) {
    if (err) {
      console.log('Error in saving album to DB:', err);
    } else {
      // res.status(201).json(data);
    }
  });
  createAlbumQuery.on('end', function(results) {
    var albumId = results.rows[0].id;
    currentAlbumToSave.albumId = albumId;
    next();
    // client.end();
  });
  },
  getAllAlbums: function(req, res) {
    // console.log("HIT GET ALL ALBUMS!");
    var client = new pg.Client(connectionString);
    client.connect();
    var albumCollection = [];
    var getAlbumsQuery = client.query("SELECT * FROM Albums");
    getAlbumsQuery.on('row', function(row) {
      albumCollection.push(row);
    });
    getAlbumsQuery.on('end', function(data) {
      res.status(200).json(albumCollection);
    });
  },
  accessAlbum: function(albumID) {
    // var albumID = req.params.id;
    // console.log("ID #######", albumID);
    var client = new pg.Client(connectionString);
    client.connect();
    var getAlbumQuery = client.query("SELECT *  FROM Albums WHERE ID="+albumID+";");
    getAlbumQuery.on('row', function(row) {
      designatedAlbum.data = row;
    });
    getAlbumQuery.on('end', function(data) {
      // console.log("ONE ALBUM D___________", designatedAlbum);
      return designatedAlbum;
    });
  },
  fetchAlbumImages: function(req, res) {
    var designatedAlbum = {};
    designatedAlbum.items = [];
    var albumID = req.params.id;

    var client = new pg.Client(connectionString);
    client.connect();
    var getAlbumQuery = client.query("SELECT *  FROM Albums WHERE ID="+albumID+";");
    getAlbumQuery.on('row', function(row) {
      designatedAlbum.data = row;
    });
    getAlbumQuery.on('end', function(data) {
      // console.log("ONE ALBUM D___________", designatedAlbum);
      // console.log('designagtealbumDATA::::::::::::', designatedAlbum);
      
      var client = new pg.Client(connectionString);
      client.connect();
      var getAlbumImagesQuery = client.query("SELECT *  FROM Images WHERE ALBUMID="+albumID+";");
      //   , function(err, result) {
      //   console.log("WITH A CALLBACK:", result);
      // });
      getAlbumImagesQuery.on('row', function(row, result) {
        // designatedAlbum.images.push(row);
        // result.addRow(row);
        designatedAlbum.items.push(row);
      });
      getAlbumImagesQuery.on('end', function(data) {
        // console.log('IMAGEquery ended @@@@@ @@@', designatedAlbum);
        res.status(200).json(designatedAlbum);
      });
    });
  },
  accessUser: function(req, res) {
    var username = req.params.username;
    var userData;
    console.log('Accessing user', req.params.username);
    var client = new pg.Client(connectionString);
    client.connect();
    var getUserQuery = client.query("SELECT * FROM Users WHERE USERNAME='"+username+"';");
    getUserQuery.on('row', function(row) {
      userData = row;
    });
    getUserQuery.on('end', function(results) {
      res.status(200).json(userData);
    });
  },
  login: function(req, res) {
    var client = new pg.Client(connectionString);
    client.connect();
    var loginUserData;
    var userExists = false;
    // console.log('Logging in', req.body.username);
    var loginUserQuery = client.query("SELECT * FROM Users WHERE USERNAME='"+req.body.username+"' AND password = crypt('"+req.body.password+"', password);");
    loginUserQuery.on('row', function(row) {
      userExists = true;
      loginUserData = row;
    });
    loginUserQuery.on('end', function(results) {
      if (!userExists) {
        // console.log("Username or password is incorrect");
        res.status(400).json("Username or password is incorrect");
      } else {
        // console.log("USER LOGGED in ----", loginUserData)
        res.status(201).json(loginUserData);
      }
    });  
  },
  signup: function(req, res) {
    var client = new pg.Client(connectionString);
    client.connect();
    // console.log('Signing up', req.body.username);
    var createdUserData;
    var userExists = false;
    //check if username already exists
    var checkUserQuery = client.query("SELECT * FROM Users WHERE USERNAME='"+req.body.username+"';");
    checkUserQuery.on('row', function(row) {
      userExists = true;
      // console.log('USER ExISTS:::', row);
    });
    checkUserQuery.on('end', function(results) {
      if (userExists) {
       res.status(400).json("Username already exists");
      } else {
        var createUserQuery = client.query("INSERT INTO Users (password, username) VALUES (crypt('"+req.body.password+"', gen_salt('bf', 8)),'"+req.body.username+"') RETURNING ID;");
        createUserQuery.on('row', function(row) {
          createdUserData = row;
        });
        createUserQuery.on('end', function(results) {
          // console.log('CREATED USER+++++', createdUserData);
          res.status(200).json(createdUserData);
        });
      }
    });
  }
}