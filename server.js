var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');

app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request

var session = require('express-session');
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

//////////////MONGOOSE///////////

var mongoose = require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose');
var QuoteSchema = new mongoose.Schema({
	name:  { type: String, required: true, minlength: 3},
	message:  { type: String, required: true, minlength: 5},
}, {timestamps: true });

mongoose.model('Quote', QuoteSchema);
// Retrieve the Schema called 'User' and store it to the variable User
var Quote = mongoose.model('Quote');

// Use native promises (only necessary with mongoose versions <= 4)
mongoose.Promise = global.Promise;

const flash = require('express-flash');
app.use(flash());

app.get('/', function (req, res){
// This is where we will retrieve the quotes from the database and include them in the view page we will be rendering.
res.render('index');
})


app.get('/quotes', function (req, res){
// This is where we will retrieve the quotes from the database and include them in the view page we will be rendering.

    Quote.find({}, function(err, quotes){
        console.log(quotes);
        if(err){
            console.log(err)
            res.render('quotes', {err})
        }else{
        res.render('quotes', {'quotes': quotes});
        }
    })
});

////////////add a quote////////////////

app.post('/add', function(req, res) {
    console.log("POST DATA", req.body);
	// This is where we would add the user from req.body to the database.
	var quote = new Quote ({name: req.body.name, message: req.body.message});
	quote.save(function(err){
        if(err){
            // if there is an error upon saving, use console.log to see what is in the err object 
            console.log("We have an error!", err);
            // adjust the code below as needed to create a flash message with the tag and content you would like
            for(var key in err.errors){
                req.flash('registration', err.errors[key].message);
            }
            // redirect the user to an appropriate route
            res.redirect('/');
        }
        else {
            res.redirect('/quotes');
        }
    });
})

app.listen(8000, function() {
    console.log("listening on port 8000");
})