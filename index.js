const PORT = 4000;

var fs 			= require("fs");
var express 	= require("express");
var bodyParser 	= require('body-parser');

var app = express();

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

/* Router parcheggi */
let parkingRouter = require('./api/routes/parking-routes');

app.use("/iello/v1", parkingRouter());

app.listen(PORT, function(){
	console.log("Listend on: " + PORT);
});