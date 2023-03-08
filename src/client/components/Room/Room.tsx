import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { actionSetField as markdownActionCreator } from '../../redux/slices/markdownSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Container from '../Markdown/Container';
import CollabRepl from '../CollabRepl/CollabRepl';
import styles from './Room.module.css';
import Zoom from '../Zoom/Zoom';

interface RoomProps {
  markdownId: string;
  roomId: string;
}

const Room = ({ markdownId, roomId }: RoomProps) => {
  return (
    <>
      <div className={styles.row}>
        <div className={styles.left}>
          <Container markdownId={markdownId} />
        </div>
        <div className={styles.middle}>
          <CollabRepl />
        </div>
      </div>
      <Zoom roomId={roomId} />
    </>
  );
};

export default Room;
