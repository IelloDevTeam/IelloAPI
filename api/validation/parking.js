
var Joi = require('joi');

var queryParkingSchema = Joi.object({
	latitude : Joi.number().positive().required(),
	longitude : Joi.number().positive().required(),
	radius : Joi.number().integer().positive()
});

var createParkingSchema = Joi.object({
	latitude : Joi.number().positive().required(),
	longitude : Joi.number().positive().required()
});

var deleteParkingSchema = Joi.object({
	id : Joi.string().required()
});

var exports = module.exports = {};

exports.validateQueryParkingSchema = function(req, res, next){

	let ret = Joi.validate(req.query, queryParkingSchema, {abortEarly: false});

	if(ret.error != undefined)
	{
		let errMsg = [];
		for (let index in ret.error.details)
			errMsg.push(ret.error.details[index].message);
		return sendResponseMessage(res, 400, "Error", errMsg);
	}
	else
		next();
}

exports.validateCreateParkingSchema = function(req, res, next)
{
	let ret = Joi.validate(req.body, createParkingSchema, {abortEarly: false});

	if(ret.error != undefined)
	{
		let errMsg = [];
		for (let index in ret.error.details)
			errMsg.push(ret.error.details[index].message);
		return sendResponseMessage(res, 400, "Error", errMsg);
	}
	else
		next();
}

exports.validateDeleteParkingSchema = function(req, res, next)
{
	let ret = Joi.validate(req.params, deleteParkingSchema, {abortEarly: false});

	if(ret.error != undefined)
	{
		let errMsg = [];
		for (let index in ret.error.details)
			errMsg.push(ret.error.details[index].message);
		return sendResponseMessage(res, 400, "Error", errMsg);
	}
	else
		next();
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

