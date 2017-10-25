/**
 * Authentication Validator
 * ===================
 * IelloDevTeam
 * ===================
 * Contiene un'middleware che valida l'header http, in fase
 * di pre-autenticazione.
 */
var Joi = require('joi');

/* Schema validazione header */
var headerSchema = Joi.object({
	authorization : Joi.string().required()
});

var exports = module.exports = {};

/** Express middleware, valida la presenza o meno dell'header di autenticazione. **/
exports.validateAuthHeader = function(req, res, next)
{
	let ret = Joi.validate(req.headers, headerSchema, {allowUnknown: true, abortEarly: false});
	if(ret.error != undefined)
		return res.status(401).json({
			status : "Unauthorized",
			message : "Invalid Api Key."
		});
	else
		next();
}
