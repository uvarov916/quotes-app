var express = require('express'),
    cons = require('consolidate'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;


var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));


// Setting up rendering engine
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + "/views");

var mongoclient = new MongoClient(new Server("localhost", 27017));
var db = mongoclient.db('quotesapp');




app.get('/', function(req, res) {
  db.collection("quotes").find({}).toArray(function(err, doc) {
    if (err) throw err;
    console.dir(doc);
    res.render('index', {"quotes": doc});
  });
});

app.get('/addQuote', function(req, res) {
  res.render('add-quote');
});

app.post('/addQuote', function(req, res) {
  console.log("Post request in da house");
  var quoteText = req.body.quote_text;
  var quoteAuthor = req.body.quote_author;
  var document = {"text": quoteText, "author": quoteAuthor};

  db.collection("quotes").insert(document, function(err, doc) {
    if (err) throw err;
    console.dir(doc);

    res.redirect('/');
  });

  console.log("text: " + quoteText);
  console.log("author: " + quoteAuthor);

  // db.collection("quotes").insert({}, function(err, doc) {
  //   if (err) throw err;
  //   console.dir(doc);
  //   res.render('index', doc);
  // });
});

app.get('*', function(req, res) {
  res.status(404).send("Page not found");
});

mongoclient.open(function(err, mongoclient) {

    if(err) throw err;

    app.listen(3000);
    console.log('Express server started on port 3000');
});