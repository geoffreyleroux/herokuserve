var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');

var app = express.createServer();

// Database

mongoose.connect('mongodb://localhost/ecomm_database');

// Config
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/api', function (req, res) {
  res.send('Ecomm API is running');
});



// Launch server

app.listen(4242);