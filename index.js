var admin = require("firebase-admin");
var express = require("express");

// aggiunta libreria per il permitero

var latlng = require("./selectionPerimeter");

var serviceAccount = require("./piattaforme-firebase-key.json");
var app = express();

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://piattaforme-ca3e9.firebaseio.com/"
});


function checkParameterMiddleware(req, res, next)
{
	var raggio = 5; //raggio di default
	var limit = 10;
	var lat = undefined;
	var lon = undefined;

	if(typeof req.query !== 'undefined')
	{
		// controllo parametri obbligatori
		if("lat" in req.query && "lon" in req.query)
		{
			console.log("Lat :" + req.query.lat);
			console.log("Lon :" + req.query.lon); 
			lat = req.query.lat;
			lon = req.query.lon;
		} else
			return sendResponseMessage(res, 400, "ERROR", "Missing Lat and Lon Parameters");

		// controllo parametri opzionali
		if("radius" in req.query)
		{
			raggio = req.query.radius;
			console.log("Raggio impostato: " + req.query.radius);
		}
		else
			console.log("Raggio impostato di default");
	
		if("limit" in req.query)
		{
			limit = req.query.limit;
			console.log("Limite lista parcheggi: " + req.query.limit);
		}
		else
			console.log("Limite lista parcheggi di default");

		res.locals.data =  {
			lat : lat,
			lon : lon,
			radius : raggio,
			limit : limit
		};

		next();
	}
}

function parkingTest(req, res, next)
{
	list_parking = [
						{
							"lat" : 43.729729729729726,
							"lon" : 12.641886092558165
						},
						{
							"lat" : 43.72613261159351,
							"lon" : 12.63678789138794
						},
						{
							"lat" : 43.726744627828545,
							"lon" : 12.636817395687103
						}
					];

	// responseJSON.parking = lista dei parcheggi
	return sendResponseMessage(res, 200, "OK", {
		"parking-count" : 3,
		"parking" : list_parking
	});
}

function filterParkingMiddleware(req, res, next)
{
	var data = res.locals.data;
	var coordinateLimite = latlng.perimetro(data.lat, data.lon, data.radius);
	
	
}

function sendResponseMessage(res, httpCode, status, message)
{
	console.log("HTTP-Status: " + httpCode + " Status: " + status + " Message: " + message);
	return res.status(httpCode).json({
		status : status,
		message : message
	});
}

app.get("/parking", checkParameterMiddleware , filterParkingMiddleware);

app.listen(3000, function(err){
	console.log("Pronto sulla porta 3000");
});
