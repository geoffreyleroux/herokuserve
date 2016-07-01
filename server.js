var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var NEWS_COLLECTION = "news";
var COMMENTS_COLLECTION = "comments";

var app = express();

app.use(function(req, res, next) {
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
    console.log("get news");
    db.collection(NEWS_COLLECTION).find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get news.");
        } else {
            res.status(200).json(docs);
        }
    });

});

/* add comment */
app.put("/news/:id/comments", function(req, res) {
    var comments = req.body;
    comments.createDate = new Date();

    db.collection(NEWS_COLLECTION).findOne({
        _id: new ObjectID(req.params.id)
    }, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get news");
        } else {
            doc.comments.push(comments);
            db.collection(NEWS_COLLECTION).updateOne({
                _id: new ObjectID(req.params.id)
            }, doc, function(err, doc) {
                if (err) {
                    handleError(res, err.message, "Failed to update news");
                } else {
                    res.status(200).end();
                }
            });
        }
    });
});

/* update vote */
app.put("/news/:id/vote", function(req, res) {
    var news = req.body;
    db.collection(NEWS_COLLECTION).findOne({
        _id: new ObjectID(req.params.id)
    }, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get news");
        } else {
            doc.vote = news.vote;
            console.log(doc)
            db.collection(NEWS_COLLECTION).updateOne({
                _id: new ObjectID(req.params.id)
            }, doc, function(err, doc) {
                if (err) {
                    handleError(res, err.message, "Failed to update news");
                } else {
                    res.status(200).end();
                }
            });
        }
    });
});

/* add news */
app.post("/news", function(req, res) {
    console.log("add news");
    var news = req.body;
    news.createDate = new Date();

    db.collection(NEWS_COLLECTION).insertOne(news, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new news.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

/* get one news */
app.get("/news/:id", function(req, res) {
    console.log("get one news");
    db.collection(NEWS_COLLECTION).findOne({
        _id: new ObjectID(req.params.id)
    }, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get news");
        } else {
            res.status(200).json(doc);
        }
    });
});

/* update one news */
app.put("/news/:id", function(req, res) {
    console.log("update one news");
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(NEWS_COLLECTION).updateOne({
        _id: new ObjectID(req.params.id)
    }, updateDoc, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to update news");
        } else {
            res.status(204).end();
        }
    });

});
/* delete one news */
app.delete("/news/:id", function(req, res) {
    console.log("delete one news");
    db.collection(NEWS_COLLECTION).deleteOne({
        _id: new ObjectID(req.params.id)
    }, function(err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete news");
        } else {
            res.status(204).end();
        }
    });
});
