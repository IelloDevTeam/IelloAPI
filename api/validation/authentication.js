var Joi = require('joi');

var headerSchema = Joi.object({
	Authorization : Joi.string().required()
});

var exports = module.exports = {};

exports.validateAuthHeader = function(req, res, next)
{
	let ret = Joi.validate(req.headers, headerSchema, {allowUnknown: true, abortEarly: false});
	if(ret.error != undefined)
	{
		let errMsg = [];
		for (let index in ret.error.details)
			errMsg.push(ret.error.details[index].message);
		return sendResponseMessage(res, 401, "Unauthorized", errMsg);
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
