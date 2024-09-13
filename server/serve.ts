// Module dependencies.
import * as debug from 'debug';

// Normalize a port into a number, string, or false.
const normalizePort = (val) => {
  const port = Number(val);
  if (Number.isNaN(port)) {
    return val; // named pipe
  }
  if (port >= 0) {
    return port; // port number
  }
  return false;
};

// Get port from environment and store in Express.
export const serve = (app, port) => {
  port = normalizePort(port);
  const server = app.createServer(port);
  server.listen(port);
  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    if (error.code === 'EACCES') {
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    } else if (error.code === 'EADDRINUSE') {
      console.error(bind + ' is already in use');
      process.exit(1);
    } else throw error;
  });

  server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Server')('Listening on ' + bind);
    console.log('Server listening on ', bind);
  });
};
