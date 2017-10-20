var express = require('express');
var app = express();

var https = require('https');
var http = require('http');
// var finalhandler = require('finalhandler');
// var serveStatic = require('serve-static');
const fs = require('fs');
const path = require('path');

var configName = path.join(process.cwd(), 'config.js');
var configDetails = require(configName);
const certificateDir = configDetails.certificateDir;

// var server = https.createServer({
//     key: fs.readFileSync( path.join(certificateDir, 'server_key.pem') ),
//     cert: fs.readFileSync( path.join(certificateDir, 'server.pem') ),
//     },function onRequest (req, res) {
//         serve(req, res, finalhandler(req, res));
//     });
// server.listen(3000);

app.get('/javascripts/qlikConfigure.js',function(req, res) {
    var configString = "var config = {host: '" + configDetails.QlikConfig.host + "',prefix: '" + configDetails.QlikConfig.prefix +"',port: "+ (configDetails.QlikConfig.secure ? 443 : 80 ) + ", isSecure: " +(configDetails.QlikConfig.secure ? "true" : "false" ) +"};";
    configString += "var EnginePort = " + configDetails.EngineConnectPort + ";";
    configString += "var EngineHost = '" + configDetails.EngineConnectHost + "';";
    // res.send("var config = {host: 'nzwel-extadn1',prefix: '/tick/',port: 443, isSecure: true};");
    res.send(configString);
});

app.use(express.static(path.join(__dirname, 'public')));

if (configDetails.runSecureHTTPS){
    https.createServer({
        key: fs.readFileSync( path.join(certificateDir, 'server_key.pem') ),
        cert: fs.readFileSync( path.join(certificateDir, 'server.pem') ),
    }, app).listen(configDetails.WebPortalPort);
}else{
    http.createServer(app).listen(configDetails.WebPortalPort);
}
console.log("Listening on port " + configDetails.WebPortalPort + "!");


