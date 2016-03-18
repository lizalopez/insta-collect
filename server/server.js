var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var db = require('./env/dbOperations.js');

var app = express();

var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// app.use(session({secret: 'P1xl33'}));

require('./controllers/routes.js')(app, express);
// require('./controllers/dbroutes.js')(app, express);

app.use(express.static(__dirname+'/../client'));
app.use('/lib',  express.static(__dirname + '/lib')); 

//setup Postgres
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost/instacollect';

var client = new pg.Client(connectionString);
client.connect();

//create db tables
var createUsersTable = client.query(db.createUsersTable);
var createAlbumsTable = client.query(db.createAlbumsTable);
var createImagesTable = client.query(db.createImagesTable);


app.listen(port);
console.log('Listening on '+ port);

module.exports = app;