var express = require('express');
var app = express();

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
var qlikauth = require('./qlik-auth');

var qApp = require('./qApp');
var qGlobal = require('./qGlobal');
let theApp = new qApp();

const _ = require('underscore');

var configName = path.join(process.cwd(), 'config.js');
var configDetails = require(configName);
const certificateDir = configDetails.certificateDir;

var profile = configDetails.Profile;
const qlikProxyName = configDetails.QlikConfig.prefix;
const qlikServerName = configDetails.QlikConfig.host;
const qlikProtocol =  "https://";
// });

 
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', (configDetails.QlikConfig.secure ? "https://" : "http://" ) + configDetails.EngineConnectHost + ':' + WebPortalPort);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
qGlobal.then((g)=> {
            if (g != null){
                console.log('Connection to Qlik Alive!');
            } else{
                console.log('Connection to Qlik DEAD!');
            };
        });
app.get('/', function(req, res) {
    qGlobal.then((g)=> {
            console.log('Connection Requested');
            if (g != null){
                console.log('Connection Alive');
                res.json('Connection Alive');
            } else {
                   console.log('Connection Dead');
            };
        });
});

app.get('/app', function(req, res) {
             qGlobal.then((g)=>{
                g.getDocList().then( (object) => {
                    console.log('App Requested');
                    res.json( object);
                });  
            });
});

app.get('/getAppName/:appguid', function(req, res) {
    Promise.all([theApp.getTitle(req.params.appguid)]).then((object) => {
            res.json(object);
    })
});
    

app.get('/app/:appguid/getAppInfo', function(req, res) {
    Promise.all([theApp.getAppInfo(req.params.appguid)]).then((object) => {
            res.json(object);
    })
});

app.get('/app/:appguid/getDimensions', function(req, res) {
    var properties = {
                qInfo: {
                    qType: "DimensionList"
                },
                qDimensionListDef: {
                    qType: "dimension",
                    qData: {
                        title: "/title",
                        tags: "/tags",
                        grouping: "/qDim/qGrouping",
                        info: "/qDimInfos"
                    }
                }
    };
    Promise.all([theApp.getAppDimensions(req.params.appguid, properties)]).then((object) => {
            res.json(object[0]);
    })
});
app.get('/app/:appguid/getMeasures', function(req, res) {
    var properties = {
        qInfo: {
            qType: "MeasureList"
        },
        qMeasureListDef: {
            qType: "measure",
            qData: {
                title: "/title",
                tags: "/tags"
            }
        }
    };
    Promise.all([theApp.getAppMeasures(req.params.appguid, properties)]).then((object) => {
            res.json(object[0]);
    })
});


app.get('/app/:appguid/getCSV', function(req, res) {
    var appId = req.params.appguid;
    var dimValue = req.query.dimensions;
    var measValue = req.query.measures;
    console.log("AppId: " + appId);
    console.log("Dimensions: " + dimValue);
    console.log("Measures: " + measValue);

    var measArray = measValue.split(',');
    var measArrayLength = measArray.length;
    var measures=new Array(measArrayLength);
    for (var i = 0; i < measArrayLength; i++) {
        measures[i] = {"qLibraryId": measArray[i] ,"qType": "measure"};
    };

    var dimArray = dimValue.split(',');
    var dimArrayLength = dimArray.length;
    var dimensions=new Array(dimArrayLength);
    for (var i = 0; i < dimArrayLength; i++) {
        dimensions[i] = {"qLibraryId": dimArray[i] ,"qType": "dimension"};
    };
    
    var properties = {
        qInfo: {
                    qType: "table"
                },
                qHyperCubeDef: {
                    qStateName: "$",
                    qDimensions: dimensions,
                    qMeasures: measures,
                    qInitialDataFetch: [{
                        qWidth: 2,
                        qHeight: 4000,
                        qTop: 0,
                        qLeft: 0
                    }]
                }
        };
        console.log(properties);
    Promise.all([theApp.getCsvUrl(req.params.appguid, properties)]).then((object) => {
            res.json(object[0]);
    })
});

app.get('/getTicket', function(req, res) {
    //Call Ticket API here
      var options={
        ProxyRestUri:(configDetails.QlikConfig.secure ? "https://" : "http://" ) + qlikServerName + ':4243/qps' + qlikProxyName,
        TargetId:'http://' + configDetails.EngineConnectHost + ':' + configDetails.EngineConnectPort,
        Certificate: certificateDir + '\\client.pfx',
        PassPhrase: ''
      };
      //Make call for ticket request
      console.log(options);
      var ticketResult = qlikauth.requestTicket(req, res, profile,options);
});

if (configDetails.runSecureHTTPS){
    https.createServer({
        key: fs.readFileSync( path.join(certificateDir, 'server_key.pem') ),
        cert: fs.readFileSync( path.join(certificateDir, 'server.pem') ),
    }, app).listen(configDetails.EngineConnectPort);
}else{
    http.createServer(app).listen(configDetails.EngineConnectPort);
}
console.log("Listening on port " + configDetails.EngineConnectPort + "!");

function censor(censor) {
  var i = 0;

  return function(key, value) {
    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
      return '[Circular]'; 

    if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';

    ++i; // so we know we aren't using the original object anymore

    return value;  
  }
}