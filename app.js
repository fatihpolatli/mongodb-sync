const nodeMongo = require("@paralect/node-mongo");
const ObjectID = require("mongodb").ObjectID;
var MongoClient = require("mongodb").MongoClient;
const args = require("yargs").argv;
const config = require("config");
var colors = require("colors");
var base64 = require("base-64");
var nodemailer = require("nodemailer");

var tableify = require("tableify");

/*
.Mail({
  secure: config.email.secure,
  host: config.email.host,
  username: config.email.username,
  port:config.email.port,
  password: base64.decode(config.email.password)
});
*/
var mail = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: config.email.username,
    pass: base64.decode(config.email.password)
  }
});

var dbName = args.db || config.source.db;

var collectionName = args.collection || config.source.collection;

var targetCollectionName =
  args.targetCollection || config.target.collection || collectionName;

var targetDbName = args.targetDb || config.target.db || dbName;

var checkAllCollections = args.checkAllCollections;

if (checkAllCollections == null) {
  checkAllCollections = config.checkAllCollections;
}

var runInsert = args.runInsert;

if (runInsert == null) {
  runInsert = config.runInsert;
}

var targetUrl = config.target.connectionString;
var sourceUrl = config.source.connectionString;

targetUrl = targetUrl.replace("{dbName}", targetDbName);
sourceUrl = sourceUrl.replace("{dbName}", dbName);

function logInfo() {
  console.log("Source DB :".underline.red, `${dbName}`.green);
  console.log("Source Collection :".underline.red, `${collectionName}`.green);
  console.log("Source Connection String :".underline.red, `${sourceUrl}`.green);
  console.log("Target DB :".underline.red, `${targetDbName}`.green);
  console.log(
    "Target Collection :".underline.red,
    `${targetCollectionName}`.green
  );
  console.log("Target Collection String :".underline.red, `${targetUrl}`.green);
  console.log(
    "Check All Collections Status :".underline.red,
    `${checkAllCollections}`.green
  );
  console.log(
    "Apply Insert to Target Status :".underline.red,
    `${runInsert}`.green
  );
  console.log("Source Connection String :".underline.red, `${sourceUrl}`.green);
}

logInfo();

var sourceDb;
var targetDb;

var collectionList = [];
var resultItemList = [];

if (checkAllCollections != 1 && collectionName != null) {
  collectionList.push(collectionName);

  startNow();
} else {
  MongoClient.connect(sourceUrl, function(err, clnt) {
    console.log("Connected successfully to server");
    console.log("dbName", dbName);
    db = clnt.db(dbName);
    db.collections(function(err, names) {
      for (var item of names) {
        collectionList.push(item.namespace.split(".")[1]);
      }

      startNow();

      clnt.close();
    });
  });
}

async function init(collectionItem) {
  collectionName = collectionItem;
  targetCollectionName = targetCollectionName || collectionName;

  var sourceSaleCollection = sourceDb.createQueryService(collectionName);

  var targetSaleCollection = targetDb.createService(targetCollectionName);

  async function getLatestRecordFromTarget() {
    return targetSaleCollection.find({}, { limit: 1, sort: { _id: -1 } });
  }

  console.log(collectionName);

  return getLatestRecordFromTarget().then(function(result) {
    //console.log("result data")

    var latestRecord = result.results[0];

    var oid = null;
    try {
      oid = new ObjectID(latestRecord._id);
    } catch (e) {
      console.error(e);
    }

    if (oid == null) {
      console.log("there is no record", collectionItem);
      return;
    }

    // console.log(oid)

    var page = 1;

    async function start() {
      //console.log("ASYNC")
      do {
        var startTime = Date.now();
        var startTimeStr = new Date();

        var docs = await sourceSaleCollection.find(
          { _id: { $gt: oid } },
          { page: page++, perPage: 100 }
        );

        var endTime = Date.now();
        var endTimeStr = new Date();

        var timeElapsed = (endTime - startTime) / 1000;
        var resultItem = getTableItem();

        resultItem.collectionName = collectionName;
        resultItem.totalCount = docs.count;
        resultItem.totalPage = docs.pagesCount;
        resultItem.currentPage = page - 1;
        resultItem.startTime = startTimeStr.toLocaleString();
        resultItem.endTime = endTimeStr.toLocaleString();
        resultItem.timeElapsed = timeElapsed;

        console.log(
          `collectionName :`.bold,
          `${collectionItem}`.yellow,
          `totalCount :`.bold,
          `${docs.count}`.yellow,
          `totalPage :`.bold,
          `${docs.pagesCount}`.yellow,
          `currentPage :`.bold,
          `${page - 1}`.yellow
        );

        var startWriteTime;
        var startWriteTimeStr;
        var endWriteTime;
        var endWriteTime;
        var timeWriteElapsed;
        if (runInsert == 1) {
          startWriteTime = Date.now();
          startWriteTimeStr = new Date();
          var insertResult = await targetSaleCollection.create(docs.results);

          endWriteTime = Date.now();
          endWriteTimeStr = new Date();

          timeWriteElapsed = (endWriteTime - startWriteTime) / 1000;

          resultItem.startWriteTime = startWriteTimeStr.toLocaleString();
          resultItem.endWriteTime = endWriteTimeStr.toLocaleString();
          resultItem.timeWriteElapsed;

          console.log("insertResult", page);
          resultItemList.push(resultItem);
        } else {
          resultItemList.push(resultItem);
          break;
        }
      } while (docs.pagesCount > page);
    }
    return start();
  });
}

async function startNow() {
  sourceDb = nodeMongo.connect(sourceUrl);
  targetDb = nodeMongo.connect(targetUrl);

  console.log("total", collectionList.length);
  for (var collectionItem of collectionList) {
    await init(collectionItem);
  }

  var html = tableify(resultItemList);

  console.log("END");
  sendMail("Done", html);
  setTimeout(function() {
    process.exit();
  }, 5000);
}

function sendMail(text, html) {
  var message = {
    from: config.email.from,
    to: config.email.to,
    subject: "MongoSync Job Message",
    text: text,
    html: html
  };
  mail.sendMail(message).then(result => {
    console.log("mail sent");
    console.log(result);
  });
}

function getTableItem() {
  // "<table><tr><th>collectionName</th><th>totalCount</th><th>totalPage</th><th>currentPage</th><th>startTime</th><th>endTime</th><th>timeElapsed</th><th>startWriteTime</th><th>endWriteTime</th><th>timeWriteElapsed</th></tr>";
  return {
    collectionName: "",
    totalCount: "",
    totalPage: "",
    currentPage: "",
    startTime: "",
    endTime: "",
    timeElapsed: "",
    startWriteTime: "",
    endWriteTime: "",
    timeWriteElapsed: ""
  };
}
