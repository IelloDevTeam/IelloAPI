var apikeySchema = require('./apikey-schema');
var moongose = require('moongose');

var Schema = moongose.Schema;

module.exports = {
	apiKeySchema : new Schema(apikeySchema.apikey)
}