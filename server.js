const express = require('express');
const app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

app.use(morgan());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
	res.send('Hello World!');
});

app.post('/', function(req, res) {
	console.log(req.body);
	res.end();
});

app.listen(3000, function() {
	console.log('Server Started');
});