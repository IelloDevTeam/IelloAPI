const PORT = 4000;

var fs 		= require("fs");
var express = require("express");
var https 	= require("https");
var app = express();

var nginx_certificate 	= fs.readFileSync('ssl/nginx.crt', 'utf8');
var nginx_key 			= fs.readFileSync('ssl/nginx.key', 'utf8');

var httpsOptions = {
    key: nginx_key,
    cert: nginx_certificate
};

/* Richiesta controller parcheggi */
var parkingController = require('./parking-controller');
var authChecker = require('./auth-checker');


app.get("/parking",
	parkingController.checkParameter,
	parkingController.getAvailableParking);

app.delete("/parking/:id",
	authChecker.checkAdminAuth,
	parkingController.delete);

https.createServer(httpsOptions, app).listen(PORT, function() {
    console.log('Express HTTPS server listening on port ' + app.get('port'));
});