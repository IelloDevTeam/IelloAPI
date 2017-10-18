/* Costanti */
const RAGGIO_DEFAULT = 500; 	// 500 metri
const LIMIT_DEFAULT = 20;	// Limite parcheggi 20

var exports = module.exports = {}

/* Richiesta della libreria per i calcoli sulle coordinate */
let coordUtil 	= require("./coord-util");
/* Richiesta della librerira per il geocoding */
let geocoding 	= require("./maps-geocoding");
let admin 		= require("firebase-admin");

admin.initializeApp({
	credential: admin.credential.cert(require("./piattaforme-firebase-key.json")),
	databaseURL: "https://piattaforme-ca3e9.firebaseio.com/"
});

/* Firebase Database */
let db = admin.database();

/* Funzione middleware per controllare i parametri ricevuti */
exports.checkQueryParameter = function(req, res, next)
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
			if(req.query.lat.trim() && req.query.lon.trim() && !isNaN(req.query.lat) && !isNaN(req.query.lon))
			{
				lat = req.query.lat;
				lon = req.query.lon;
			} else
				return sendResponseMessage(res, 400, "ERROR", "Invalid Latitude or Longitude Parameter");
		} else
			return sendResponseMessage(res, 400, "ERROR", "Missing Latitude or Longitude Parameter");

		// controllo parametri opzionali
		if("radius" in req.query)
		{
			if(!isNaN(req.query.radius) && req.query.radius.trim())
			{
				raggio = req.query.radius;			
				console.log("Raggio impostato: " + req.query.radius);
			}
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

/* Funzione middleware per inviare la lista dei parcheggi disponibili */
exports.getAvailableParking = function(req, res, next)
{
	/* Recupero dati validati da checkParameter */
	let latitudine = res.locals.data.lat;
	let longitudine = res.locals.data.lon;
	let raggio = res.locals.data.radius;

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

exports.checkBody = function(req, res, next)
{
	let body = req.body;

	if(body.hasOwnProperty('latitude') && body.hasOwnProperty('longitude'))
	{
		if(body.latitude.toString().trim() && body.longitude.toString().trim() && !isNaN(body.latitude) && !isNaN(body.longitude))
		{
			res.locals.data =  {
				lat : body.latitude,
				lon : body.longitude
			};
			next();
		}
		else
			return sendResponseMessage(res, 400, "Bad Request", "Invalid Latitude or Longitude");
	}
	else
		return sendResponseMessage(res, 400, "Bad Request", "Invalid JSON");
}


/* Funzione per inserimento parcheggio */
exports.create = function(req, res, next)
{
	/* Recupero dati validati */
	let lat = res.locals.data.lat;
	let lon = res.locals.data.lon;

	geocoding.reverseGeocoding(lat, lon, function(results){
		if(results.length > 0)
		{
			let address = results[0].formatted_address;
			db.ref("/segnalazioni").push().set({
				latitude : lat,
				longitude : lon,
				street_address : address
			}, function(err){
				if(!err) console.log(err);
			});
		}
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

