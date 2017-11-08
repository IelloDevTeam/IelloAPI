/**
 * Manager API Key
 * ===================
 * IelloDevTeam
 * ===================
 * Manager per la gestione delle chiavi di autenticazione
 */
 
let fs = require('fs');
let uuidv4 = require("uuid/v4");
let path = require('path');

var exports = module.exports = {};

/** Funzione che restituisce il ruolo associato ad una api key **/
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
		delete apikeys[oldKey];

	// genero nuova chiave per quel ruolo.
	let newKey = uuidv4();
	let cleanKey = newKey.split('-').join('');
	apikeys[cleanKey] = role;
	writeJson(apikeys);

	return cleanKey;
}

exports.getKeysRole = function()
{
	return readFromJson();
}

function readFromJson()
{
	if(!fs.existsSync(path.join(__dirname, '../config/keys.json')))
	{
		// Creo nuovo file
		fs.writeFileSync(path.join(__dirname, '../config/keys.json'), "{}", "UTF-8");
	}
	return require('../config/keys.json');
}

function writeJson(json)
{
	fs.writeFileSync(path.join(__dirname, '../config/keys.json'), JSON.stringify(json), "UTF-8");
}