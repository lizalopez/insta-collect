var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost/instacollect';
var Promise = require('bluebird');
var request = require('request');
var keys = require('../env/keys');
// var _ = require('lodash')

var imagesInDBToAddToAlbum = [];
var currentAlbumToSave = {};
var designatedAlbum = {};
designatedAlbum.images = [];

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
  console.log('ALBUM TO CREATE >>>> ', album);
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
    console.log("HIT GET ALL ALBUMS!");
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
  accessAlbum: function(req, res, next) {
    var albumID = req.params.id;
    console.log("ID #######", albumID);
    var client = new pg.Client(connectionString);
    client.connect();
    var getAlbumQuery = client.query("SELECT *  FROM Albums WHERE ID="+albumID+";");
    getAlbumQuery.on('row', function(row) {
      designatedAlbum.data = row;
    });
    getAlbumQuery.on('end', function(data) {
      console.log("ONE ALBUM D___________", designatedAlbum);
      next();
    });
  },
  fetchAlbumImages: function(req, res) {
    var albumID = req.params.id;

    var client = new pg.Client(connectionString);
    client.connect();
    var getAlbumImagesQuery = client.query("SELECT *  FROM Images WHERE ID="+albumID+";");
    getAlbumImagesQuery.on('row', function(row) {
      designatedAlbum.images.push(row);
    });
    getAlbumImagesQuery.on('end', function(data) {
      res.status(200).json(designatedAlbum);
    });
  },
  accessUser: function(req, res) {
    console.log('Accessing user');
    res.status(200);
  },
  login: function(req, res) {
    console.log('Logging in');
    res.send(201);
  },
  signup: function(req, res) {
    console.log('Signing up');
    res.send(201);
  }
}