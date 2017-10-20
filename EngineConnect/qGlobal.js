const enigma = require('enigma.js');
const qixSchema = require('./node_modules/enigma.js/schemas/qix/3.1/schema.json');  
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

var configName = path.join(process.cwd(), 'config.js');
var configDetails = require(configName);
const certificateDir = configDetails.certificateDir;



const config = {  
    schema: qixSchema,  
    session: configDetails.QlikConfig,
    createSocket: (url, sessionConfig) => {
        return new WebSocket(url, {
        ca: [fs.readFileSync(path.resolve(certificateDir, 'root.pem'))],
        key: fs.readFileSync(path.resolve(certificateDir, 'client_key.pem')),
        cert: fs.readFileSync(path.resolve(certificateDir, 'client.pem')),
        headers: {
            'X-Qlik-User': `UserDirectory=${configDetails.EngineUserProfile.UserDirectory};UserId=${configDetails.EngineUserProfile.UserId}`
            // 'X-Qlik-User': `UserDirectory=${process.env.USERDOMAIN};UserId=${process.env.USERNAME}`
        }
        });
    }
}; 
module.exports = enigma.getService('qix', config).then((qix) => {return qix.global;});