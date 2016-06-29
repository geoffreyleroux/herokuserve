var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var NEWS_COLLECTION = "news";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
// mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, database) {
//   if (err) {
//     console.log(err);
//     process.exit(1);
//   }
  // Connect to the database before starting the application server.
mongodb.MongoClient.connect("mongodb://geoffrey:a@ds023694.mlab.com:23694/heroku_bv9n9svh", function(err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({
    "error": message
  });
}

/* get all news */
app.get("/news", function(req, res) {
  console.log("TEST");
});
/* add news */
app.post("/news", function(req, res) {
  console.log("TEST");

});
/* get one news */
app.get("/news/:id", function(req, res) {
  console.log("TEST");
});
/* update one news */
app.put("/news/:id", function(req, res) {
  console.log("TEST");

});
/* delete one news */
app.delete("/news/:id", function(req, res) {
  console.log("TEST");
});