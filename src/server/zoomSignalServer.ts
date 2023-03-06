import { Server } from 'socket.io';
import http from 'http';

const rooms: { [key: string]: Set<string> } = {};
const mapSocketToEmail: { [key: string]: string } = {};

export const attachZoomSignalServer = function (httpServer: http.Server) {
  // Syntax for socket.io changed in v4
  // https://stackoverflow.com/questions/71866234/not-a-constructor-error-if-i-upgrade-socket-io
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
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
      console.log('offer');
      io.to(payload.target).emit('offer', payload);
    });

    socket.on('answer', (payload) => {
      console.log('answer');
      io.to(payload.target).emit('answer', payload);
    });

    socket.on('ice-candidate', (incoming) => {
      io.to(incoming.target).emit('ice-candidate', incoming);
    });
  });
};
