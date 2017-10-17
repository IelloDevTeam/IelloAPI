let fs = require('fs');
let uuidv4 = require("uuid/v4");

var exports = module.exports = {};

exports.getRole = function(apikey)
{
	var json = readFromJson();
	return (json[apikey]);	// callback per role
}

/* Aggiunge nuova api key per un certo ruolo */
exports.addNewApiKey = function(role)
{
	let apikeys = readFromJson();
	let oldKey = undefined;
	Object.keys(apikeys).forEach(function(key){
		if(apikeys[key] == role)
		{
			oldKey = key;
		}
	});

	// elimino vecchia chiave se presente
	if(oldKey != undefined)
		delete apikeys[key];

	// genero nuova chiave per quel ruolo.
	let newKey = uuidv4();
	apikeys[newKey] = role;
	writeJson(apikeys);
}

function readFromJson()
{
	return require('./keys.json');
}

function writeJson(json)
{
	fs.writeFileSync('./keys.json', JSON.stringify(json), "UTF-8");
}