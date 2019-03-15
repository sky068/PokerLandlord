var pomelo = require('pomelo');
var routeUtil = require('./util/routeUtil');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'poker');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
        connector: pomelo.connectors.hybridconnector,
        heartbeat: 3,
        useDict: true,
        useProtobuf: true
    });
});

app.configure('production|development', 'gate', function(){
    app.set('connectorConfig',
        {
            connector : pomelo.connectors.hybridconnector
        });
});

app.configure('production|development', function() {
    // route configures
    app.route('game', routeUtil.gameRoute);

    // filter configures
    // app.filter(pomelo.timeout());
});

// var timeInterval = require("./app/components/timeInterval");
// app.configure('production|development', 'master', function() {
//     app.load(timeInterval, {interval: 1000});
// });

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
