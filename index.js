const PORT = 4000;

var express = require("express");
var app = express();

/* Richiesta controller parcheggi */
var parkingController = require('./parking-controller');

app.get("/parking",
	parkingController.checkParameter,
	parkingController.getAvailableParking);

app.delete("/parking/:id",
	//checkAuth,
	parkingController.delete);

app.listen(PORT, function(err){
	console.log("Pronto sulla porta " + PORT);
});