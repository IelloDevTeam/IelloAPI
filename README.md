# **Documentazione API**

## Indice contenuti
1. [Lista API](#lista-api)
    1.1. [GET: /parking](#get-parking)
    1.2. [DELETE: /parking](#delete-parkingid)
2. [Example2](#example2)
3. [Third Example](#third-example)

### Lista API
=========

GET: /parking
--------

| URI | Http Method  | Description                                                             |
|-------------|----------|-------------------------------------------------------------------------|
| /parking         | GET | Restituisce i parcheggi trovati in base alla propria posizione inviata. |

| Field     | Type    | Required  | Description                                       | Default Value |
|-----------|---------|-----------|---------------------------------------------------|---------------|
| latitude  | Double  | Si        | Latitudine della propria posizione                | N/A           |
| longitude | Double  | Si        | Longitudine della propria posizione               | N/A           |
| radius    | Integer | Opzionale | Raggio in metri a partire dalla propria posizione | 500          |

Esempio di richiesta <br>
- I parcheggi presenti in un raggio di 500m attorno a Lecce.

    curl -H "Content-type: application/json" -H "Accept: application/json" -X GET "http://cloudpi.webhop.me:4000/parking?lat=40.353988&lon=18.173937"

##### Risposta:

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 2491
    Date: Fri, 13 Oct 2017 10:08:35 GMT
    Connection: keep-alive
    

````json
{
  "status": "OK",
  "message": {
    "parking_count": 5,
    "parking": [
      {
        "latitudine": 40.35236,
        "longitudine": 18.17303,
        "distance": 196,
        "street_address": "Via e. alvino, 73100 Lecce LE, Italy"
      },
      {
        "latitudine": 40.35222,
        "longitudine": 18.17318,
        "distance": 206,
        "street_address": "Via Vito Fazzi, 6, 73100 Lecce LE, Italy"
      },
      {
        "latitudine": 40.3521328,
        "longitudine": 18.1750238,
        "distance": 225,
        "street_address": "Via G. Marconi, 16, 73100 Lecce LE, Italy"
      },
      {
        "latitudine": 40.3540536,
        "longitudine": 18.1767357,
        "distance": 237,
        "street_address": "Viale Felice Cavallotti, 19, 73100 Lecce LE, Italy"
      },
      {
        "latitudine": 40.3561691,
        "longitudine": 18.1738794,
        "distance": 242,
        "street_address": "Via Marco Aurelio, 2, 73100 Lecce LE, Italy"
      }
    ]
  }
}
````

L'oggetto JSON restitutito contiene lo status delle riposta, in questo caso "OK", e "message", ovvero il messaggio di riposta inviato dal server, il contenuto di questo dipende dallo status.<br>
Una richiesta di questo tipo invece, produrrà una risposta di errore, in quanto uno dei due parametri obbligatori è mancante.
````
curl -H "Content-type: application/json" -H "Accept: application/json" -X GET "http://cloudpi.webhop.me:4000/parking?lat=40.353988"
````

##### Risposta:

````
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 2491
Date: Fri, 13 Oct 2017 10:08:35 GMT
Connection: keep-alive
````

````json
{
  "status":"ERROR",
  "message":"Missing Latitude or Longitude Parameter"
}
````


DELETE: /parking/{:id}
--------
| URI | Http Method  | Description                                                             |
|-------------|----------|-------------------------------------------------------------------------|
| /parking/\{:id\}         | DELETE | Elimina un parcheggio corrispondente all'id. |

| Parameter    | Type    | Required  | Description                                       | Default Value |
|-----------|---------|-----------|---------------------------------------------------|---------------|
| id  | String  | Si        | Id del parcheggio da eliminare.                | N/A           |

````
curl -H "Content-type: application/json" -H "Accept: application/json" -X DELETE "http://cloudpi.webhop.me:4000/parking/-KuiWVXyrGm46Y45hd21"
````

##### Risposta:
````json
{
  "status":"ERROR",
  "message":"Missing Latitude or Longitude Parameter"
}
````
