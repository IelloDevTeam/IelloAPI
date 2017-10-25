/**
 * Coords Utility
 * ===================
 * IelloDevTeam
 * ===================
 * Funzioni utili per i calcoli relativi alle coordinate,
 * in particolare esporta due funzioni, quella per il calcolo della
 * distanza da un punto ad un altro e il calcolo dei quattro punti cardinali
 * dati un raggio e una posizione.
 */
const R_MAJOR = 6378137.0;
const R_MINOR = 6356752.3142;
const RATIO = R_MINOR / R_MAJOR;
const ECCENT = Math.sqrt(1.0 - (RATIO * RATIO));
const COM = 0.5 * ECCENT;
const PI_2 = Math.PI / 2.0;

// funzione che trasforma i gradi in radianti
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// funzione che trasforma i radianti in gradi
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

// funzione che tresforma la longitudine in metri
 var lonToX= function(lon)
    {
        return R_MAJOR * Math.radians(lon);
    }

// funzione che trasforma la latitudine in metri	
var latToY = function(lat)
    {
        lat = Math.min(89.5, Math.max(lat, -89.5));
        var phi = Math.radians(lat);
        var sinphi = Math.sin(phi);
        var con = ECCENT * sinphi;
        con = Math.pow(((1.0 - con) / (1.0 + con)), COM);
        var ts = Math.tan(0.5 * ((Math.PI * 0.5) - phi)) / con;
        
		return 0 - R_MAJOR * Math.log(ts);
    }   

// funzione che trasforma i metri in una longitudine
var xToLon = function (x)
    {
        return Math.degrees(x) / R_MAJOR;
    }

// funzione che trasforma i metri in una latitudine	
var yToLat = function(y)
    {
        var ts = Math.exp(-y / R_MAJOR);
        var phi = PI_2 - 2 * Math.atan(ts);
        var dphi = 1.0;
        var i = 0;
        while ((Math.abs(dphi) > 0.000000001) && (i < 15))
        {
            var con = ECCENT * Math.sin(phi);
            dphi = PI_2 - 2 * Math.atan(ts * Math.pow((1.0 - con) / (1.0 + con), COM)) - phi;
            phi += dphi;
            i++;
        }
        return Math.degrees(phi);
    }

// funzione che calcola il perimetro selezionato
module.exports = {
    perimetro : function(lat, longi, r)
    {
    
        var perimetro = [];
        
        let radius = parseInt(r);

        let x = lonToX(longi);
        let y = latToY(lat);

        // console.log("X: " + x + "\nY: " + y);

        let Y_NORD = y + radius;
        let Y_SUD = y - radius;

        let X_EST = x + radius;
        let X_OVEST = x - radius;
        
        /* console.log("Max Y nord: " + (y + radius));
        console.log("Max X est: " + (x + radius));
        console.log("Min X ovest: " + X_OVEST);
        console.log("Min Y sud: " + Y_SUD);
        console.log("----------\n"); */

        var LAT_SUD = yToLat(Y_SUD);
        var LAT_NORD = yToLat(Y_NORD); 
        var LONG_EST = xToLon(X_EST);
        var LONG_OVEST = xToLon(X_OVEST);
        
        // metto i risultati nell'array 
        perimetro.push(LAT_NORD);
        perimetro.push(LONG_EST);
        perimetro.push(LAT_SUD);
        perimetro.push(LONG_OVEST);
        
        return perimetro;
    },

    /** Restituisce distanza in Km tra due coordinate **/
    distance : function(lat1, lon1, lat2, lon2)
    {
        var R = 6371; // Radius of the earth in km
        var dLat = Math.radians(lat2 - lat1);  // deg2rad below
        var dLon = Math.radians(lon2 - lon1); 
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(Math.radians(lat1)) * Math.cos(Math.radians(lat2)) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);

        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
    }
};

/*var p = require("./selectionPerimeter");

p.perimetro(43.529629, 13.259408, 600000);
console.log("----------------------\n");
p.perimetro(43.529629, 13.259408, 100);*/
