var keymanager = require('./api/auth/apikey-manager');
var readline = require('readline');
var menu;

function showMainMenu(){
	console.log("--------- Console API KEY Iello ----------");

	console.log(
		"Main Menu\n\n" + 
		"1. Show API Key\n" + 
		"2. Generate new key\n" + 
		"3. Refresh existing key\n" +
		"0. Exit\n"
		);

	if(menu) menu.close();

	menu = readline.createInterface({
		input: process.stdin,
	    output: process.stdout
	});

	menu.question("Select an option:", function(input){
		switch(input)
		{
			case '0' : process.exit(); break;
			case '1' : showAPIKeys(); break;
			case '2' : showNewKeyMenu(); break;
		}
	});
}

function showNewKeyMenu(){
	process.stdout.write('\033c');

	if(menu) menu.close();
	menu = readline.createInterface({
		input: process.stdin,
	    output: process.stdout
	});

	menu.question("Insert the role for new API Key: ", function(input){
		let newKey = keymanager.addNewApiKey(input);
		console.log("New api key generated for role " + input + "\n" + 
			"\t" + newKey);
		console.log("-----------------------------");
		showMainMenu();
	});
}

function showAPIKeys()
{
	let keysRole = keymanager.getKeysRole();
	let count = 1;

	process.stdout.write('\033c');
	console.log("Key disponibili: ");
	console.log("------------------------------------------");

	Object.keys(keysRole).forEach(function(key){
		/** 1. Role Api Key **/
		console.log(count + ".\t" + keysRole[key] + "\t" + key);
		count++;
	});
}

process.stdout.write('\033c');
showMainMenu();