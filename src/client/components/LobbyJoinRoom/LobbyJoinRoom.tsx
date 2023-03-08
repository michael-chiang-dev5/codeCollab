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
        return <div key={uuid()}>{`${room.countusers}`}</div>;
      })}
    </>
  );
};

export default LobbyJoinRoom;
