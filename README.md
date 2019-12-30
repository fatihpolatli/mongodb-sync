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
        "connectionString": "mongodb://<username>:<password>@<mongodb-url>/{dbName}"
    },
    "target": {
        "db": "roo",
        "collection": "menuItem",
        "connectionString": "mongodb://<username>:<password>@<mongodb-url>/{dbName}"
    },
    "email": {
        "secure": true,
        "host": "<smtp-host>",
        "username": "username",
        "password": "******",
        "from": "MongoDB Sync <mail@mail.com>",
        "to": "mail@mail.com",
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

