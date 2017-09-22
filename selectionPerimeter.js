
const R_MAJOR = 6378137.0;
const R_MINOR = 6356752.3142;
const RATIO = R_MINOR / R_MAJOR;
const ECCENT = Math.sqrt(1.0 - (RATIO * RATIO));
const COM = 0.5 * ECCENT;
const PI_2 = Math.PI / 2.0;

var exports = module.exports = {};

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
exports.perimetro = function(lat, longi, r){
    
    var perimetro = [];
    
    // coordinate di partenza
    var y = latToY(lat);//latitudine 
    var x = lonToX(longi);//longitudine 

    // perimetro desiderato
    // latitudine
    var dis_Y_NORD = y + r; // linea di 5 km, 2,5 a nord e 2,5 a sud del punto
    var dis_Y_SUD = y - r;
    // longitudine
    var dis_X_EST = x + r; 
    var dis_X_OVEST = x - r;      
    
    // perimetro finale
    // latitudine
    var LAT_SUD = yToLat(dis_Y_SUD); // latitudine (2,5 km a sud del punto)
    var LAT_NORD = yToLat(dis_Y_NORD); // latitudine (2,5 km a nord del punto)
    // longitudine
    var LONG_EST = xToLon(dis_X_EST);
    var LONG_OVEST = xToLon(dis_X_OVEST);
    
    // metto i risultati nell'array 
    perimetro.push(LAT_NORD);
    perimetro.push(LONG_EST);
    perimetro.push(LAT_SUD);
    perimetro.push(LONG_OVEST);
    
    return perimetro;
}