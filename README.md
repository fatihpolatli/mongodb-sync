# mongo-sync-script

sync mongodb collections between dbs

## Requirements

* NodeJS

## Install Instructions

```javascript
npm install
```
## Run Instructions

```javascript
node ./app.js
```

## Sample Config File

```json
{
    "runInsert": 0,
    "checkAllCollections": 0,
    "source": {
        "db": "roo",
        "collection": "menuItem",
        "connectionString": "mongodb://omer:Qazx.123!@lingaproduction-shard-00-00-outu1.mongodb.net:27017,lingaproduction-shard-00-01-outu1.mongodb.net:27017,lingaproduction-shard-00-02-outu1.mongodb.net:27017/{dbName}?ssl=true&replicaSet=LingaProduction-shard-0&authSource=admin&retryWrites=true&w=majority"
    },
    "target": {
        "db": "roo",
        "collection": "menuItem",
        "connectionString": "mongodb://omer:Qazx.123!@deneme-shard-00-00-outu1.mongodb.net:27017,deneme-shard-00-01-outu1.mongodb.net:27017,deneme-shard-00-02-outu1.mongodb.net:27017/{dbName}?ssl=true&replicaSet=deneme-shard-0&authSource=admin&retryWrites=true&w=majority"
    },
    "email": {
        "secure": true,
        "host": "smtp.sendgrid.net",
        "username": "username",
        "password": "******",
        "from": "MongoDB Sync <autoemail@email.lingapos.com>",
        "to": "oner@lingapos.com",
        "port": 587
    }
}
```

## Fields

| Fields        | Explanation           | Values  |
| ------------- |:-------------:| -----:|
| runInsert      | run insert action | 0 / 1 |
| checkAllCollections     | check all collections inside db ignoring collection name given      |   0 / 1 |

## Command Line Arguments

| Commandline         | Explanation           | Values  |
| ------------- |:-------------:| -----:|
| --runInsert      | override runInsert | 0 / 1 |
| --checkAllCollections     | override checkAllCollections      |   0 / 1 |
| --collection     | override source.collection      |  string |
| --db     | override source.db      |  string |
| --targetCollection     | override target.collection      |  string |
| --targetDb     | override target.db      |  string |

