
var express = require("express");

module.exports = function() {
	
	let validator		= require('../validation/parking');
	let authValidator	= require('../validation/authentication');
	let parking 		= require('../controllers/parking-controller');
	let auth 			= require('../auth/apikey-manager');
	let authManager 	= require('../auth/auth-manager');
	
	let router = express.Router();

	/** Route per /parking
		GET: 2 middleware, uno per la validazione dei parametri query,
			 ed uno per l'effetiva lettura dei parcheggi disponibili **/
	router.route("/parking")
		.get(validator.validateQueryParkingSchema,
			 parking.get)

		/** POST: 4 middleware, validatore header autenticazione, controllo permesso di admin,
				  validazione richiesta, esecuzione richiesta **/
		.post(authValidator.validateAuthHeader,
			  authManager.checkRole("admin"),
			  validator.validateCreateParkingSchema,
			  parking.create);

	/** Route per /parking/:id
		DELETE: 4 middleware, come metodo POST precedente **/
	router.route("/parking/:id")
		.delete(authValidator.validateAuthHeader,
			  	authManager.checkRole("admin"),
				validator.validateDeleteParkingSchema,
				parking.delete);

	/** Route per nuova segnalazione 
		POST: 4 middleware **/
	router.route("/parking/report")
		.post(authValidator.validateAuthHeader,
			  authManager.checkRole("admin", "user"),
			  validator.validateCreateParkingSchema,
			  parking.report);

	return router;
};