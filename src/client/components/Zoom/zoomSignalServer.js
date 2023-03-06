const cors = require('cors');
const express = require('express');
const http = require('http');
const app = express();
const httpServer = http.createServer(app);
const { Server: SocketIoServer } = require('socket.io'); // https://stackoverflow.com/questions/71866234/not-a-constructor-error-if-i-upgrade-socket-io
const io = new SocketIoServer(httpServer, {
  cors: {
    origin: '*',
  },
});
PORT = 5555;
DEBUG = true;
const rooms = {};
const mapSocketToEmail = {};

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.get('/rooms', (req, res) => {
  const body = { ...rooms };
  for (let key in body) {
    const socketIds = Array.from(body[key]);
    body[key] = socketIds.map((e) => {
      return { socketId: e, email: mapSocketToEmail[e] };
    });
  }
  return res.status(200).json(body);
});

io.on('connection', (socket) => {
  console.log('peer connected to signal server');

  socket.on('disconnect', (reason) => {
    console.log(socket.id, 'leaving');
    for (let key in rooms) {
      if (rooms[key].has(socket.id)) {
        rooms[key].delete(socket.id);
        // notify everybody else has disconnected
        for (let otherUser of Array.from(rooms[key])) {
          socket.to(otherUser).emit('user left', socket.id);
        }
      }
    }
  });

  socket.on('join room', (payload) => {
    const roomID = payload.roomId;
    mapSocketToEmail[socket.id] = payload.email;
    if (rooms[roomID]) {
      rooms[roomID].add(socket.id);
    } else {
      rooms[roomID] = new Set([socket.id]);
    }
    if (DEBUG)
      console.log(
        `user ${socket.id} joined room`,
        roomID,
        `with ${rooms[roomID]?.size ?? 0} other users`,
        `(${rooms[roomID] ? Array.from(rooms[roomID]) : 'empty room'})`
      );

    // need to deep copy
    const setUsers = new Set(rooms[roomID]);
    const setOtherUsers = setUsers;
    setOtherUsers.delete(socket.id);
    if (setOtherUsers.size > 0) {
      const otherUsers = Array.from(setOtherUsers);
      for (let i = 0; i < otherUsers.length; i++) {
        const otherUser = otherUsers[i];
        socket.emit('other user', otherUser); // unfortunately, you can't send arrays with emit\
        socket.to(otherUser).emit('user joined', socket.id);
      }
    }
  });

  socket.on('offer', (payload) => {
    if (DEBUG) console.log('offer');
    io.to(payload.target).emit('offer', payload);
  });

  socket.on('answer', (payload) => {
    if (DEBUG) console.log('answer');
    io.to(payload.target).emit('answer', payload);
  });

  socket.on('ice-candidate', (incoming) => {
    io.to(incoming.target).emit('ice-candidate', incoming);
  });
});

httpServer.listen(PORT, () => console.log(`server is running on port ${PORT}`));
