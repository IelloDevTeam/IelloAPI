var admin = require("firebase-admin");

var serviceAccount = require("./piattaforme-firebase-key.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://piattaforme-ca3e9.firebaseio.com/"
});

var db = admin.database();
var ref = db.ref("/segnalazioni");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});