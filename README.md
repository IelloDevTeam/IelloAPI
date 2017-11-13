# IelloAPI #

Questa repository contiene il codice dell'API di [Project Iello](https://prezi.com/p/bkqagzs4v_w5/). L'API consente agli sviluppatori di accedere a funzioni molto utili per l'interrogazione del database remoto del progetto, implementato tramite il servizio Google per sviluppatori [Firebase Database](https://firebase.google.com/docs/database/). L'utilizzo dell'API aggiunge delle funzionalità molto utili agli sviluppatori interessati alla consultazione delle informazioni raccolte, per accedere ai dati in modo più facile e sicuro.


## Indice contenuti ##
* [Prerequisiti](#prerequisiti)
* [Lista API](#lista-api)
  * [GET: /parking](#get-parking)
  * [POST: /parking](#post-parking)
  * [DELETE: /parking/{:id}](#delete-parking-id)
  * [POST: /parking/report](#post-parking-report)
* [Autorizzazione](#autorizzazione)
* [Licenza](#licenza)
* [Contatti & Credits](#contatti--credits)


## Prerequisiti ##

Questo paragrafo illustra con quali strumenti è stata sviluppata e messa in funzione le API, fornendo un algoritmo per poterla eventualmente replicare.

Le API sono state sviluppando utilizzando [Node.JS](https://nodejs.org/it/), in particolare utilizzando il [modulo Express](http://expressjs.com/it/). È necessario installare sia Node.JS che il [package manager npm](https://www.npmjs.com/). 

Il database è stato implementato tramite il servizio [Google Firebase Database](https://firebase.google.com/docs/database/). Il servizio fornisce un database JSON remoto, molto utile soprattutto in quanto scalabile a seconda delle esigenze.

Installazione NodeJS e NPM:

1. Effettuare il clone del repository.
2. Posizionarsi all'interno della cartella IelloAPI
3. Installare le dipendenze tramite npm:
   ````
   npm install
   ````
4. Copiare il file contenente la chiave di amministratore di Firebase
5. Avviare la console per la gestione delle chiavi:
   ````
   node authconsole.js
   ````
6. Selezionare l'opzione 2, per creare delle nuove chiavi per il ruolo di "admin" e "user".
7. Quando richiesto il nome del ruolo inserite "admin". 
8. Ripetere il passo 6 e 7 per generare una chiave utente, inserendo questa volta il ruolo "user".
9. Avviare il server.
   ````
   node index.js
   ````
10. Ora è possibile fare richieste al server, ricordando di utilizzare quando richiesto le chiavi di autenticazione.
   
   
## Lista API ##

### /parking ###

| URI | Http Method  | Description                                                             |
|-------------|----------|-------------------------------------------------------------------------|
| /parking         | GET | Restituisce i parcheggi trovati in base alla propria posizione inviata. |
| /parking         | POST | Aggiunge un nuovo parcheggio. |


#### GET: /parking ####

| Field     | Type    | Required  | Description                                       | Default Value |
|-----------|---------|-----------|---------------------------------------------------|---------------|
| latitude  | Double  | Si        | Latitudine della propria posizione                | N/A           |
| longitude | Double  | Si        | Longitudine della propria posizione               | N/A           |
| radius    | Integer | Opzionale | Raggio in metri a partire dalla propria posizione | 500          |


Esempio di richiesta <br>
- I parcheggi presenti in un raggio di 500m attorno a Lecce.

````
curl -H "Content-type: application/json" -H "Accept: application/json" -X GET 
"http://cloudpi.webhop.me:4000/iello/v1/parking?latitude=40.353988&longitude=18.173937"
````

##### Risposta:

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 2491
    Date: Fri, 13 Oct 2017 10:08:35 GMT
    Connection: keep-alive
    

````json
{
  "status": "Success",
  "message": {
    "parking_count": 5,
    "parking": [
      {
        "id": "-KvaXq2PA_Yb3T4rJgAy",
        "latitude": 40.35236,
        "longitude": 18.17303,
        "distance": 196,
        "street_address": "Via e. alvino, 73100 Lecce LE, Italy"
      },
      {
        "id": "-KvaXq3Lw8KNw5bwYOWs",
        "latitude": 40.35222,
        "longitude": 18.17318,
        "distance": 206,
        "street_address": "Via Vito Fazzi, 6, 73100 Lecce LE, Italy"
      },
      {
        "id": "-KvaXq2W0dx8L4DZCZ6L",
        "latitude": 40.3521328,
        "longitude": 18.1750238,
        "distance": 225,
        "street_address": "Via G. Marconi, 16, 73100 Lecce LE, Italy"
      },
      {
        "id": "-KvaXq3XMJ_st9JBz_x6",
        "latitude": 40.3540536,
        "longitude": 18.1767357,
        "distance": 237,
        "street_address": "Viale Felice Cavallotti, 19, 73100 Lecce LE, Italy"
      },
      {
        "id": "-KvaXq3MABuOC3KxYSXf",
        "latitude": 40.3561691,
        "longitude": 18.1738794,
        "distance": 242,
        "street_address": "Via Marco Aurelio, 2, 73100 Lecce LE, Italy"
      }
    ]
  }
}
````

L'oggetto JSON restitutito contiene lo status delle riposta, in questo caso "Success", e "message", ovvero il messaggio di riposta inviato dal server, il contenuto di questo dipende dallo status.<br>
Una richiesta di questo tipo invece, produrrà una risposta di errore, in quanto uno dei due parametri obbligatori è mancante.
````
curl -H "Content-type: application/json" -H "Accept: application/json" -X GET
"http://cloudpi.webhop.me:4000/iello/v1/parking?latitude=40.353988"
````

##### Risposta:

````
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 64
Date: Sat, 21 Oct 2017 15:02:24 GMT
Connection: keep-alive
````

````json
{
    "status": "Bad request",
    "message": [
        "\"longitude\" is required"
    ]
}
````


#### POST: /parking
Aggiunge direttamente un nuovo parcheggio alla piattaforma. È necessaria una chiave di autenticazione riservata agli amministratori.

Corpo della richiesta: 
````json
{
  "latitude" : <latitudine_parcheggio>,
  "longitude" : <longitudine_parcheggio> 
}
````

````
curl -H "Content-type: application/json" -H "Accept: application/json" -H "Authorization: <admim_api_key>"
 -X POST -d '{ "latitude" : <lat>, "longitude" : <long> }' "http://cloudpi.webhop.me:4000/iello/v1/parking"
````

##### Risposta:
````
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 58
Date: Sat, 21 Oct 2017 15:11:12 GMT
Connection: keep-alive
````

````json
{
    "status": "Success",
    "message": "Parking report registered"
}
````

In caso di errore il server risponde nei seguenti modi, rispettivamente quando il corpo della richiesta non è valido, quando fallisce il caricamento di nuovo parcheggio e quando non riesce ad identificare un indirizzo valido per le coordinate del parcheggio inviato.
````
HTTP/1.1 500
````
Corpo non valido.
````json
{
    "status": "Bad request",
    "message": [
        "\"latitude\" is required"
    ]
}
````
Errore generico di creazione parcheggio.
````json
{
    "status": "Error",
    "message": "Parking reporting failed"
}
````
Il server non riesce ad associare un indirizzo valido alla posizione del parcheggio.
````json
{
    "status": "Error",
    "message": "Unable to identify the parking position"
}
````

#### DELETE: /parking/{:id} ####
Permette l'eliminazione di un parcheggio esistente. È necessaria una chiave di autenticazione riservata agli amministratori.

| URI | Http Method  | Description                                                             |
|-------------|----------|-------------------------------------------------------------------------|
| /parking/\{:id\}         | DELETE | Elimina un parcheggio corrispondente all'id. |

| Parameter    | Type    | Required  | Description                                       | Default Value |
|-----------|---------|-----------|---------------------------------------------------|---------------|
| id  | String  | Si        | Id del parcheggio da eliminare.                | N/A           |

Per l'autenticazione basta aggiungere l'header "Authorization" e la relativa chiave. "-KuiWVXyrGm46Y45hd21" è l'id del parcheggio da eliminare.
````
curl -H "Content-type: application/json" -H "Accept: application/json" -H "Authorization: <admim_api_key>" 
-X DELETE "http://cloudpi.webhop.me:4000/iello/v1/parking/-KuiWVXyrGm46Y45hd21"
````

##### Risposta:
````
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 40
Date: Sat, 21 Oct 2017 14:38:58 GMT
Connection: keep-alive
````

````json
{
  "status": "Success",
  "message": "Park deleted"
}
````


#### POST: /parking/report

Permette di segnalare un parcheggio- La differenza con la creazione di un parcheggio è che la segnalazione non aggiunge direttamente il parcheggio alla piattaforma, inoltre in questo caso è richiesta un'autenticazione "utente", nel caso della creazione è necessaria un'autenticazione "admin".

| URI | Http Method  | Description                                                             |
|-------------|----------|-------------------------------------------------------------------------|
| /parking/report         | POST | Segnala un nuovo parcheggio alla piattaforma. |

<strong>Il corpo della richiesta e l'esecuzione della richiesta sono identici alla creazione di un nuovo parcheggio. </strong>


## Autorizzazione

Alcune richieste necessitano di autenticazione tramite una chiave, inviata tramite l'header http "Authorization".
Il server risponde nei seguenti modi in caso di problemi di autorizzazione.

**Se l'header Authorization non viene inviato, il server risponde nel seguente modo:**
````
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 54
Date: Sat, 21 Oct 2017 14:48:51 GMT
Connection: keep-alive
````

````
{
    "status": "Unauthorized",
    "message": "Invalid Api Key."
}
````

**In caso di autenticazione non riuscita, o nel caso in cui non si dispongano dei permessi sufficienti per effettuare l'operazione, il server risponde nel seguente modo:**
````
HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 58
Date: Sat, 21 Oct 2017 14:53:10 GMT
Connection: keep-alive
````

````
{
    "status": "Forbidden",
    "message": "Not Enough Permissions."
}
````


## Licenza ##

MIT License

Copyright (c) 2017 IelloDevTeam

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


## Contatti & Credits ##
API realizzata come parte di un progetto di esame (PDGT) da [Riccardo Maldini](https://github.com/maldins46), [Andrea Petreti](https://github.com/petretiandrea), [Alessia Ventani](https://github.com/AlessiaVe) e [Elia Trufelli](https://github.com/EliaT95).
