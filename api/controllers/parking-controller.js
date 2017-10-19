/* Costanti */
const RAGGIO_DEFAULT = 500; 	// 500 metri
const LIMIT_DEFAULT = 20;	// Limite parcheggi 20

var exports = module.exports = {}

let admin 		= require("firebase-admin");
/* Richiesta della libreria per i calcoli sulle coordinate */
let coordUtil 	= require("../utils/coord-util");
/* Richiesta della librerira per il geocoding */
let geocoding 	= require("../utils/maps-geocoding");

admin.initializeApp({
	credential: admin.credential.cert(require("../config/piattaforme-firebase-key.json")),
	databaseURL: "https://piattaforme-ca3e9.firebaseio.com/"
});

/* Firebase Database */
let db = admin.database();

/* Funzione middleware per inviare la lista dei parcheggi disponibili */
exports.get = function(req, res, next)
{
	/* Recupero dati validati da checkParameter */
	let latitudine = req.query.latitude;
	let longitudine = req.query.longitude;
	let raggio = ("radius" in req.query) ? req.query.radius : RAGGIO_DEFAULT;

	/* Calcolo cordinate limite per un certo raggio */
	let coordinateLimite = coordUtil.perimetro(latitudine, longitudine, raggio);

	var minLon = coordinateLimite[3];
	var maxLon = coordinateLimite[1];
	var minLat = coordinateLimite[2];
	var maxLat = coordinateLimite[0];

	let parking = [];

	/* Richesta parcheggi disponibili su firebase */
	db.ref("/posti").orderByChild("longitudine")
			.startAt(minLon)
			.endAt(maxLon)
			.once("value", function(snapshot) {

		// per ogni risultato filtro sulla latitudine
		snapshot.forEach(function(child){
			let parkLat = child.val().latitudine;
			let parkLon = child.val().longitudine;
			if(parkLat >= minLat && parkLat <= maxLat)
			{
				// aggiungo un parcheggio ai risultati
				// calcolo distanza tra il parcheggio e la posizione dell'utente
				let dist = coordUtil.distance(latitudine, longitudine, parkLat, parkLon);
				parking.push({
					id : child.key,
					latitudine : parkLat,
					longitudine : parkLon,
					distance : Math.trunc((dist * 1000)),
					street_address : child.val().street_address
				});

				// Ordinamento in base alla distanza
				parking.sort(function(elem1, elem2){
					return elem1.distance - elem2.distance;
				});
			}
		});

		sendResponseMessage(res, 200, "OK", {
			"parking_count" : parking.length,
			"parking" : parking
		});

	}, function(error){
		console.log(error);
		sendResponseMessage(res, 500, "ERROR", "Database Error");
	});
}


/* Funzione per inserimento parcheggio */
exports.create = function(req, res, next)
{
	/* Recupero dati validati */
	let lat = req.body.latitude;
	let lon = req.body.longitude;

	geocoding.reverseGeocoding(lat, lon, function(results){
		if(results.length > 0)
		{
			let address = results[0].formatted_address;
			db.ref("/segnalazioni").push().set({
				latitude : lat,
				longitude : lon,
				street_address : address
			})
			.then(function(){
				return sendResponseMessage(res, 200, "Success", "Parking report registered");
			})
			.catch(function(error){
				return sendResponseMessage(res, 500, "Error", "Parking reporting failed");
			});
		}
		else
			return sendResponseMessage(res, 500, "Error", "Unable to identify the parking position");
	});
}

/* Funzione per eliminazione parcheggio */
exports.delete = function(req, res, next)
{
	let parkId = req.params.id;

	db.ref("/posti").child(parkId).remove()
		.then(function() {
    		sendResponseMessage(res, 200, "OK", "Park deleted");
  		})
  		.catch(function(error) {
    		console.log("Error during deleting parking with id: " + parkId);
			sendResponseMessage(res, 500, "ERROR", "Error during deleting of parking");
  		});
}

/* Funzione per inviare una risposta HTTP */
function sendResponseMessage(res, httpCode, status, message)
{
	console.log("HTTP-Status: " + httpCode + " Status: " + status + " Message: " + message);
	return res.status(httpCode).json({
		status : status,
		message : message
	});
}

