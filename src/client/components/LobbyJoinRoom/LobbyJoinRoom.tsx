import axios from 'axios';
import React, { useEffect, useState } from 'react';

const LobbyJoinRoom = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `api/rooms/`,
    }).then((res) => {
      console.log(res.data);
    });
  }, []);

  return <>asdf</>;
};

export default LobbyJoinRoom;
