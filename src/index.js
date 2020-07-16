const app = require('./app')
// const debug = require('debug')('toolbox-api')
const http = require('http')
// const pkg = require('../package.json')
const teamsLogger = require('./models/teams-logger')

app.set('port', process.env.NODE_PORT)
// Node HTTP module options
const httpOptions = {
  // 16k header size. 8k is just barely too small sometimes, 
  // with dcloud cookies plus our JWT (especially when admin uses switch-user)
  maxHeaderSize: 8196*2
}
// create HTTP server instance
const server = http.createServer(httpOptions, app)

server.listen(process.env.NODE_PORT, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env)
  // log to Webex Teams room
  teamsLogger.log('service started')
})
server.on('error', onError)
server.on('listening', onListening)
/**
* Event listener for HTTP server "error" event.
*/

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const port = process.env.NODE_PORT
  var bind = typeof port === 'string'
  ? 'Pipe ' + port
  : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
    case 'EADDRINUSE':
    console.error(bind + ' is already in use');
    process.exit(1);
    break;
    default:
    throw error;
  }
}

/**
* Event listener for HTTP server "listening" event.
*/

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
  ? 'pipe ' + addr
  : 'port ' + addr.port;
  // debug('Listening on ' + bind);
  console.log('Express.js listening on ' + bind)
}
