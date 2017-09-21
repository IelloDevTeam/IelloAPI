var admin = require("firebase-admin");
var express = require("express");

var serviceAccount = require("./piattaforme-firebase-key.json");
var app = express();

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://piattaforme-ca3e9.firebaseio.com/"
});

var db = admin.database();
var ref = db.ref("/segnalazioni");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});

app.get("/parking", function(req, res){
	if(typeof req.query !== 'undefined')
	{
		if("radius" in req.query)
			console.log("Raggio impostato: " + req.query.radius);
		else
			console.log("Raggio impostato di default");
	
		console.log(req.query);

		if("lat" in req.query && "lon" in req.query)
		{
			console.log("Lat :" + req.query.lat);
			console.log("Lon :" + req.query.lon); 
		} else 
			console.log("Latitudine e longitudie sono obbligatori");
	}
	res.send("ciao");
});

app.listen(3000, function(err){});
