
var express = require("express");

module.exports = function(){
	let validator	= require('../validation/parking');
	let authValidator	= require('../validation/authentication');
	let parking 	= require('../controllers/parking-controller');
	let auth 		= require('../auth/apikey-manager');
	let router = express.Router();

	router.route("/parking")
		.get(validator.validateQueryParkingSchema,
			 parking.get)

		.post(authValidator.validateAuthHeader,
			  validator.validateCreateParkingSchema,
			  parking.create);

	router.route("/parking/:id")
		.delete(// auth check
				validator.validateDeleteParkingSchema);
				//controller.delete);

	return router;
};