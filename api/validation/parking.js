
var Joi = require('joi');

/** Schema di valizione per query dei parcheggi disponibili **/
var queryParkingSchema = Joi.object({
	latitude : Joi.number().positive().required(),
	longitude : Joi.number().positive().required(),
	radius : Joi.number().integer().positive()
});

/** Schema di validazione per la creazione di una segnalazione/parcheggio **/
var createParkingSchema = Joi.object({
	latitude : Joi.number().positive().required(),
	longitude : Joi.number().positive().required()
});

/** Schema di validazione per l'eliminazione di un parcheggio **/
var deleteParkingSchema = Joi.object({
	id : Joi.string().required()
});

var exports = module.exports = {};

/** Express middleware di validazione per parametri query **/
exports.validateQueryParkingSchema = function(req, res, next){

	let ret = Joi.validate(req.query, queryParkingSchema, {abortEarly: false});
	let errors = collectErrors(ret);

	if(errors != undefined)
		return res.status(400).json({
			status : "Bad request",
			message : errors
		});
	else
		next();
}

/** Express middleware di validazione per schema di creazione parcheggio **/
exports.validateCreateParkingSchema = function(req, res, next)
{
	let ret = Joi.validate(req.body, createParkingSchema, {abortEarly: false});
	let errors = collectErrors(ret);

	if(errors != undefined)
		return res.status(400).json({
			status : "Bad request",
			message : errors
		});
	else
		next();
}

/** Express middleware di validazione per schema di eliminazione parcheggio **/
exports.validateDeleteParkingSchema = function(req, res, next)
{
	let ret = Joi.validate(req.params, deleteParkingSchema, {abortEarly: false});
	let errors = collectErrors(ret);

	if(errors != undefined)
		return res.status(400).json({
			status : "Bad request",
			message : errors
		});
	else
		next();
}

/** Colleziona gli errori in un array **/
function collectErrors(errors)
{
	if(errors != undefined)
	{
		let errmsg = [];
		for (let index in ret.error.details)
			errmsg.push(unescape(ret.error.details[index].message));
		return errmsg;
	}
	return undefined;
}

