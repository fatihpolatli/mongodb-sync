const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID


// Connection URL
const stageUrl = 'mongodb://omer:Qazx.123!@deneme-shard-00-00-outu1.mongodb.net:27017,deneme-shard-00-01-outu1.mongodb.net:27017,deneme-shard-00-02-outu1.mongodb.net:27017/test?ssl=true&replicaSet=deneme-shard-0&authSource=admin&retryWrites=true&w=majority';
const liveUrl = 'mongodb://omer:Qazx.123!@lingaproduction-shard-00-00-outu1.mongodb.net:27017,lingaproduction-shard-00-01-outu1.mongodb.net:27017,lingaproduction-shard-00-02-outu1.mongodb.net:27017/test?ssl=true&replicaSet=LingaProduction-shard-0&authSource=admin&retryWrites=true&w=majority';

const url = stageUrl;
// Database Name
const dbName = 'Linga';
var stageDb;
var liveDb;

var liveClient;
var stageClient;

getCount(stageDb, stageUrl,stageClient, function(r){

    console.log(r);

    //stageClient.close();

    getCount(liveDb, liveUrl,liveClient, function(r){

        console.log(r);
    
        //liveClient.close();
    })
})



function getCount(db, url,client, callback){

 
    // Use connect method to connect to the server

    if(db != null){

        getCountData(db , callback);
    }else{

        getDb(db,url,client, function(d){

            db = d;

            getCountData(db , callback);
        })
    }
   
    
    //5e01fa847be2450001902705 2019-12-24T11:46:12.000Z 2019-12-24T11:46:12.187Z
    /*
        collection.find({}).sort({"_id":-1}).skip(100).limit(1).toArray(function(err, docs) {
        
        console.log("Found the following records");
        for(item of docs){
    
    //console.log(item._id)
    
    var objectId = new ObjectID(item._id);
    console.log(objectId,objectId.getTimestamp(), item.dateCreated)
        }
        
        
        
        });
    */
        
}

function getDb(db,url,client, callback){

    MongoClient.connect(url, function(err, clnt) {
    
        console.log("Connected successfully to server");
        client = clnt;
        db = clnt.db(dbName);
    
        callback(db);

    });
}

function getCountData(db , callback){

    const collection = db.collection('sale');
    var oid = new ObjectID("5e01f9301bc75a0001e5ee97");

   return collection.count({}).then(r =>{
   
    callback(r);

   });
}