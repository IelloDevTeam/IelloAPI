
var exports = module.exports = {};

var apikey = require('./apikey-manager');

/** Funzione che restituisce un express middleware che verifica
	i ruoli ammessi per una determinata richiesta **/
module.exports.checkRole = function(...roles){

	return (req, res, next) => {
		if(isAllowed(apikey.getRole(req.headers.authorization), roles))
			next();
		else
			return res.status(403).json({
				status : "Forbidden",
				message : "Not Enough Permissions."
			});
	};
}

/** Verifica la presenza di role in roles **/
function isAllowed(role, roles)
{
	return roles.indexOf(role) > -1;
}