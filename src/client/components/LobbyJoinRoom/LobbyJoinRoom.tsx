import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RoomType } from '../../../types/types';
import { v4 as uuid } from 'uuid';
import styles from './LobbyJoinRoom.module.css';

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
      {rooms.length === 0 ? (
        <h1>Nobody here! You should create a new room instead</h1>
      ) : (
        rooms.map((room) => {
          const users: string = JSON.parse(room.users).join(', ');
          // 4 is the markdownId for the markdown that explains room entry
          const url = process.env.WEBSITE_URL + 'room/4/' + room.roomid;
          return (
            <div className={styles.row} key={uuid()}>
              <a href={url}>Join </a>
              <div className="userList">{users}</div>
            </div>
          );
        })
      )}
    </>
  );
};

export default LobbyJoinRoom;
