## Interrogazione API

### URL Base
Risponse con un JSON contente i parcheggi più vicini in un raggio di default.
http://indirizzo:porta/parking?lat=valore_lat&lon=valore_long

## Esempio risposta JSON
### Codice Risposta HTTP: 200 (OK), quando il codice http è 200 si ottiene una risposta in json con la seguente struttura:
```json
{
    "status": "OK",
    "message": {
        "parking_count": 3,
        "parking": [
            {
                "lat": 43.729729729729726,
                "lon": 12.641886092558165
            },
            {
                "lat": 43.72613261159351,
                "lon": 12.63678789138794
            },
            {
                "lat": 43.726744627828545,
                "lon": 12.636817395687103
            }
        ]
    }
}
```
I parcheggi sono ordinati dal più vicino al più lontano.


### Codice Risposta HTTP: 400 (Bad Request)
Indica che sono stati passati parametri invalidi o mancano dei parametri, il server risponde con la seguente struttra json:
Esempio: Mancanza di parametri latitudine o longitudine
URL : http://localhost:3000/parking o http://localhost:3000/parking?lat=34.650075675

```json
{
    "status": "ERROR",
    "message": "Missing Lat and Lon Parameters"
}
```

### Codice Risposta HTTP: 500
Indica un'errore del server, tipicamente dovuto al database.

```json
{
    "status": "ERROR",
    "message": "Database Error"
}
```

## Parametri variabili
- **radius**: indica il raggio di ricerca in metri, di __default è impostato a 500 metri__.
    ```
    http://indirizzo:porta/parking?lat=valore_lat&lon=valore_long&radius=distanza_metri     
    ```