let keymanager = require('./apikey-manager');


/* Controllo autorizzazione da admin */
exports.checkAdminAuth = function(req, res, next)
{
	if(!req.headers.authorization)
		return sendResponseMessage(res, 200, "Unauthorized", "No apikey sended!");
	else
	{
		if(keymanager.getRole(req.headers.authorization) == "admin")
			next();
		else
			return sendResponseMessage(res, 200, "Unauthorized", "");
	}
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