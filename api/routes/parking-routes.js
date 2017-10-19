
var express = require("express");

module.exports = function(){
	let controller 	= require('../controllers/parking-controller');
	let auth 		= require('../auth/apikey-manager');
	let router = express.Router();

	router.route("/parking")
		.get(controller.checkQueryParameter,
			 controller.getAvailableParking)
		.post(// auth check
			  controller.checkBody,
			  controller.create);

	router.route("/parking/:id")
		.delete(// auth check
				controller.delete);

	return router;
};