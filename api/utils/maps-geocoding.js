/**
 * Maps Geocoding
 * ===================
 * IelloDevTeam
 * ===================
 * Raccolta delle funzioni utili alla geolocalizzazione, in particolare
 * viene implementata la funzione di reverse geocoding, tramite le 
 * API Google Maps
 */
const API_KEY = "AIzaSyCZksjE7PEbGwiK0Sr7RwPyAqOJY2wM9O4";

var https = require("https");

var exports = module.exports = {};

/** Funzione per reverse geocoding.
	Dati latitudine e longitudine, tramite le API google maps, effettua
	un reverse geocoding per ottenere l'indirizzo assocciato alla posizione **/
exports.reverseGeocoding = function(lat, lon, callback)
{
	let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
	url += lat + "," + lon + "&key=" + API_KEY;
	let request = https.get(url, res =>
	{
		let body = "";
		//res.setEnconding("utf8");
		res.on('data', chunk => {body += chunk});
		res.on('end', () => {
			body = JSON.parse(body);
			// se esiste prendo il primo risultato attendibile
			if(body.status === "OK")
				callback(body.results);
			else if(body.status === "ZERO_RESULTS")
				callback(undefined);
		});
	});
}