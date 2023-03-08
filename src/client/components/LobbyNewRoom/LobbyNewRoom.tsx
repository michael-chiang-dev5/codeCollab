import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, redirect, useNavigate } from 'react-router-dom';
import styles from './LobbyNewRoom.module.css';
import { MarkdownsWithMetaDataType } from '../../../types/types';
import { v4 as uuid } from 'uuid';

const LobbyNewRoom = () => {
  const [markdowns, setMarkdowns] = useState<MarkdownsWithMetaDataType>([]);
  // on page load, get list of markdowns (and their associated metadata) from backennd
  useEffect(() => {
    const response = axios({
      method: 'get',
      withCredentials: true,
      url: '/api/markdown/all',
      // we cannot use async/await in useEffect without wrapping in outer function
    }).then((res) => {
      const data: MarkdownsWithMetaDataType = res.data;
      setMarkdowns(data);
    });
  }, []);

  const navigate = useNavigate(); // used for programmatic redirect
  return (
    <>
      <div className={`${styles.column}`}>
        <h3>List of code challenges</h3>
        {markdowns.map((e) => (
          <div>
            <a href={`/room/${e._id}/${uuid()}`}>{e.title}</a>
          </div>
        ))}
      </div>
    </>
  );
};

export default LobbyNewRoom;
