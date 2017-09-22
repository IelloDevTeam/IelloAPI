var admin = require("firebase-admin");
var express = require("express");

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
			list_parking = [{
				        "lat" : 52.0239430,
				        "lon" : 36.5478996
				      },
				      {
				        "lat" : 12.9454535,
				        "lon" : 10.4434095
				      },
				      {
				        "lat" : 32.4545435,
				        "lon" : 40.3294328
				      }];

		// responseJSON.parking = lista dei parcheggi
		return sendResponseMessage(res, 200, "OK", {
			"parking-count" : 3,
			"parking" : list_parking
		});
}

app.get("/parking", checkParameterMiddleware , parkingTest);

function sendResponseMessage(res, httpCode, status, message)
{
	console.log("HTTP-Status: " + httpCode + " Status: " + status + " Message: " + message);
	return res.status(httpCode).json({
		status : status,
		message : message
	});
}

app.listen(3000, function(err){
	console.log("Pronto sulla porta 3000");
});
