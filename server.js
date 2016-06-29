var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var NEWS_COLLECTION = "news";

var app = express();

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
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
    db.collection(NEWS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      res.status(200).json(docs);
    }
  });

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