import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RoomType } from '../../../types/types';
import { v4 as uuid } from 'uuid';

const LobbyJoinRoom = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);

  useEffect(() => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `api/room/`,
    }).then((res) => {
      setRooms(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <>
      {rooms.map((room) => {
        const users: string = JSON.parse(room.users).join(', ');
        // 4 is the markdownId for the markdown that explains room entry
        const url = process.env.WEBSITE_URL + '4/' + room.roomId;
        return (
          <div className="room" key={uuid()}>
            <div className="userList">{users}</div>
            <a href={url}>Join</a>
          </div>
        );
      })}
    </>
  );
};

export default LobbyJoinRoom;
