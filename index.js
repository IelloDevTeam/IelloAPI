const PORT = 3000;
const RAGGIO_DEFAULT = 500; 	// 500 metri
const LIMIT_DEFAULT = 20;	// Limite parcheggi 20

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

var db = admin.database();

function checkParameterMiddleware(req, res, next)
{
	var raggio = RAGGIO_DEFAULT; //raggio di default
	var limit = LIMIT_DEFAULT;
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

		res.locals.data =  {
			lat : lat,
			lon : lon,
			radius : raggio
		};

		next();
	}
}

// funzione di test
/* function parkingTest(req, res, next)
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
} */

function filterParkingMiddleware(req, res, next)
{
	var data = res.locals.data;
	console.log(data.radius);
	var coordinateLimite = latlng.perimetro(data.lat, data.lon, data.radius);

	var minLon = coordinateLimite[3];
	var maxLon = coordinateLimite[1];
	var minLat = coordinateLimite[2];
	var maxLat = coordinateLimite[0];

	var parking = [];

	var ref = db.ref("/posti");

	ref.orderByChild("longitudine")
			.startAt(minLon)
			.endAt(maxLon)
			.on("value", function(snapshot) {
		// appena ricevo i dati rimuovo la callback.
		ref.off();

		// per ogni risultato filtro sulla latitudine
		snapshot.forEach(function(child){
			var lat = child.val().latitudine;
			if(lat >= minLat && lat <= maxLat)
			{
				// aggiungo un parcheggio ai risultati
				parking.push({
					latitudine : lat,
					longitudine : child.val().longitudine
				});
			}
		});

		sendResponseMessage(res, 200, "OK", {
			"parking-count" : parking.length,
			"parking" : parking
		});

	}, function(error){
		console.log(error);
		sendResponseMessage(res, 500, "ERROR", "Database Error");
	});
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

app.listen(PORT, function(err){
	console.log("Pronto sulla porta " + PORT);
});
