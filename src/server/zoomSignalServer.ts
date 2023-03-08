import { Server } from 'socket.io';
import http from 'http';
import { db } from './db/dbPostgreSQL';

/*
 rooms is a mapping between users (parameterized by socket ids) and room urls
   For example: rooms = { 
                           'flashy-aardvark' : Set(['a31d', 'b32s']),
                           'stupendous-wolf' : Set(['4x4n'])
                        }
   tells us there are two users in room "flash-aardvark"
*/
const rooms: { [key: string]: Set<string> } = {};
/*
  mapSocketToEmail maps socketId to usernames
  For example: 
    'CxWs' : 'past-gamefowl'
    'lhli' : 'lesser-cattle'

*/
const mapSocketToEmail: { [key: string]: string } = {};

const usernamesInRoom = function (roomid: string) {
  const room = rooms[roomid];
  const socketIds = Array.from(room);
  return socketIds.map((socket) => mapSocketToEmail[socket]);
};

export const attachZoomSignalServer = function (httpServer: http.Server) {
  // since we are starting up the server, clear all rooms from database
  db.deleteAllRooms();

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
      for (let roomid in rooms) {
        if (rooms[roomid].has(socket.id)) {
          rooms[roomid].delete(socket.id);
          // notify everybody else has disconnected
          for (let otherUser of Array.from(rooms[roomid])) {
            socket.to(otherUser).emit('user left', socket.id);
          }
          const usernames = usernamesInRoom(roomid);
          db.insertOrUpdateRoom(
            roomid,
            rooms[roomid].size,
            '',
            JSON.stringify(usernames)
          );
        }
      }
    });

    socket.on('join room', (payload) => {
      const roomid = payload.roomid;
      mapSocketToEmail[socket.id] = payload.email;
      if (rooms[roomid]) rooms[roomid].add(socket.id);
      else rooms[roomid] = new Set([socket.id]);

      // need to deep copy
      const setUsers = new Set(rooms[roomid]);
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
      const usernames = usernamesInRoom(roomid);
      db.insertOrUpdateRoom(
        roomid,
        rooms[roomid].size,
        '',
        JSON.stringify(usernames)
      );
    });

    // forwards sdp information from sender to receiver
    // TODO: payload type is SdpType in Zoom.tsx
    socket.on('offer', (payload) => {
      console.log('offer forwarded');
      io.to(payload.target).emit('offer', payload);
    });
    // forwards sdp information from sender to receiver
    // Note this is the same type as payload in offer event
    // TODO: payload type is SdpType in Zoom.tsx
    socket.on('answer', (payload) => {
      console.log('answer');
      io.to(payload.target).emit('answer', payload);
    });

    // forwards ice-candidate from sender to receiver
    // TODO: incoming type is IceCandidateType in Zoom.tsx
    socket.on('ice-candidate', (incoming) => {
      io.to(incoming.target).emit('ice-candidate', incoming);
    });
  });
};
