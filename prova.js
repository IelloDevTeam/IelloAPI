var admin = require("firebase-admin");

var serviceAccount = require("./smart-sensor.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smartsensor-27e8c.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("/valori");

for(var i = 0; i < 4; i++)
{
    var n1 = random(50, 1);
    var n2 = random(50, 1);
    var valore = ref.push();
    valore.set({
        n1 : n1,
        n2 : n2,
        key : n1 + "_" + n2       
    });
}



ref.orderByChild("key").on("child_added", function(snapshot) {
  console.log(snapshot.key + " n1 " + snapshot.val().n1 + " n2 " + snapshot.val().n2);
});


function random (low, high) {
    return Math.random() * (high - low) + low;
}