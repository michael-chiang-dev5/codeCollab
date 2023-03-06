export const attachZoomSignalServer = function (httpServer) {
  const { Server } = require('socket.io'); // https://stackoverflow.com/questions/71866234/not-a-constructor-error-if-i-upgrade-socket-io
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('peer connected to signal server');
  });
};
