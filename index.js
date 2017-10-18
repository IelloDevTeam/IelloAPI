const PORT = 4000;

var fs 			= require("fs");
var express 	= require("express");
//var https 		= require("https");
var bodyParser 	= require('body-parser');

var app = express();

//var nginx_certificate 	= fs.readFileSync('ssl/nginx.crt', 'utf8');
//var nginx_key 			= fs.readFileSync('ssl/nginx.key', 'utf8');

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
})); 

/*var httpsOptions = {
    key: nginx_key,
    cert: nginx_certificate
};*/

/* Richiesta controller parcheggi */
var parkingController = require('./parking-controller');
var authChecker = require('./auth-checker');

let router = express.Router();

router.route("/parking")
	.get(parkingController.checkQueryParameter,
		 parkingController.getAvailableParking)

	.post(authChecker.checkAdminAuth,
		  parkingController.checkBody,
		  parkingController.create);
	
router.delete("/parking/:id",
		authChecker.checkAdminAuth,
		parkingController.delete);

app.use("/iello/v1", router)

app.listen(PORT, function(){
	console.log("Listend on: " + PORT);
})

/* https.createServer(httpsOptions, app).listen(PORT, function() {
    console.log('Express HTTPS server listening on port ' + app.get('port'));
}); */