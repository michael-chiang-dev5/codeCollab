import { appCreator } from './appCreator';
import http from 'http';
const PORT = 8080;

// create express server
const app = appCreator();

const httpServer = http.createServer(app);
const { Server } = require('socket.io'); // https://stackoverflow.com/questions/71866234/not-a-constructor-error-if-i-upgrade-socket-io
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('peer connected to signal server');
});

// app.listen(PORT, () => {
//   console.log(`Server listening on port: ${PORT}...`);
// });

httpServer.listen(PORT, () => console.log(`server is running on port ${PORT}`));
