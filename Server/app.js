const fs = require('fs');
require('dotenv').config()
const express = require('express');
var cors = require('cors')
const http = require('http');
const https = require('https');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
const ParseAuditor = require('parse-auditor');

var corsOptions = {
  origin: [
    '*',
    'http://localhost:*',
  ],
  optionsSuccessStatus: 200
}

// const httpsOptions = {
//   cert: fs.readFileSync('./ssl/yourcert.crt'), 
//   ca: fs.readFileSync('./ssl/yourbundle.ca-bundle'), 
//   key: fs.readFileSync('./ssl/yourkey.key')
// };

var app = express();

const httpServer = http.createServer(app);
// const httpsServer = https.createServer(httpsOptions, app);


var api = new ParseServer({ 
  databaseURI: process.env.NODE_ENV === 'production' ? process.env.dbURI : process.env.devDB,
  cloud: './cloud/main.js',
  appId: process.env.appID,
  masterKey: process.env.masterkey,
  serverURL: process.env.serverURL,
  enableAnonymousUsers: false,
	allowClientClassCreation: false,
  rateLimit: {
    requestPath: '*',
    requestTimeWindow: 15 * 60 * 1000,
    requestCount: 200,
  },
  liveQuery: {
    classNames: ['SOMECLASS'], 
    websocketPort: process.env.httpPORT,
    websocketOptions: {
      server: process.env.serverURL,
      path: '/v2',
    }
  }
})

//////////////////////////////////////////////////////
//////// Parse Dashboard
////////////////////////////////////////  
const customConfig = {
  classPrefix: '',
  classPostfix: '_HISTORY',
  fieldPrefix: 'audit_',
  fieldPostfix: '',
  parseSDK: Parse,
  useMasterKey: true,
  clp: {}
};
ParseAuditor(['SOMECLASS'], [], customConfig);
var options = { allowInsecureHTTP: true };

var dashboard = new ParseDashboard({
	"apps": [
    {
      "serverURL": process.env.serverURL,
      "appId": process.env.appID,
      "masterKey": process.env.masterkey,
      "appName": "AppName"
    } 
  ],
  "users": [
    {
      "user":"SomeUser",
      "pass":"SomePass",
      "apps": [{
        "appId": "AppName"
      }]
    } 
  ],
  "trustProxy": 1
}, options);


// Serve the Parse API at /parse URL prefix
app.use('/v2', api);
app.use(cors(corsOptions))
app.use('/dashboard', dashboard);

app.get('/', function(req, res) {
  res.send("Running.");
});

app.get('/webhook', function(req, res) {
  var data = req.body;
  res.status(200).send("Webhook received a call...");
});

httpServer.listen(process.env.httpPORT);
// httpsServer.listen(process.env.httpsPORT);

var parseLiveQueryServer = ParseServer.createLiveQueryServer(httpServer);

console.log(`HTTP Server running on PORT ${process.env.httpPORT}`)
// console.log(`HTTPS Server running on PORT ${process.env.httpsPORT}`)