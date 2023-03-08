import React, { useEffect } from 'react';
import styles from './App.module.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { defaultMethod } from 'react-router-dom/dist/dom';
import { v4 as uuid } from 'uuid';
import CollabCodeEditor from '../CollabCodeEditor/CollabCodeEditor';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { actionSetField } from '../../redux/slices/userSlice';
import { RootState } from '../../redux/store';
import Zoom from '../Zoom/Zoom';
import CollabRepl from '../CollabRepl/CollabRepl';
import Markdown from '../Markdown/Markdown';
import MarkdownContainer from '../Markdown/Container';
import Room from '../Room/Room';
import Wrapper from '../Room/Wrapper';
import LobbyNewRoom from '../LobbyNewRoom/LobbyNewRoom';
import { UserType } from '../../../types/types';
import LobbyJoinRoom from '../LobbyJoinRoom/LobbyJoinRoom';
// These are the left items on the navbar
const leftItems = {
  Home: '/',
  'New room': '/lobbyNewRoom',
  'Join room': '/lobbyJoinRoom',
};
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';

function App() {
  const email = useSelector((state: RootState) => state.user.email);
  const dispatch = useDispatch();

  // On mount, get user data
  useEffect(() => {
    // we cannot use async/await in useEffect without wrapping in outer function
    const response = axios({
      method: 'get',
      withCredentials: true,
      url: 'auth/user',
    })
      .then((res) => {
        if (res.data) {
          const data: UserType = res.data;
          dispatch(actionSetField({ field: 'sub', value: data.sub }));
          dispatch(actionSetField({ field: 'picture', value: data.picture }));
          dispatch(actionSetField({ field: 'email', value: data.email }));
          dispatch(actionSetField({ field: '_id', value: data._id }));

          // if anonymous user, give them a random email
          if (data.email === '') {
            const anonName = uniqueNamesGenerator({
              dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
              separator: '-',
              length: 2,
            });
            dispatch(actionSetField({ field: 'email', value: anonName }));
          }
        }
      })
      .catch((err) => console.log('error accessing auth/user'));
  }, []);

  return (
    <>
      <BrowserRouter>
        <div className={`${styles.row} ${styles.navbar}`}>
          <div className={`${styles.row}`}>
            {Object.entries(leftItems).map((e) => {
              const [title, url] = e;
              return (
                <div className={styles.margin} key={uuid()}>
                  <a href={url}>{title}</a>
                </div>
              );
            })}
          </div>

          <div className={styles.row}>
            <div className={styles.margin}>
              {email ? (
                <a href="/auth/logout">logout</a>
              ) : (
                <a href={`/auth/google`}>log in</a>
              )}
            </div>
          </div>
        </div>
        <div>
          <Routes>
            <Route
              path="/ComponentCollabCodeEditor"
              element={<CollabCodeEditor />}
            />
            <Route
              path="/ComponentZoom"
              element={<Zoom roomId={'asdf'} cardId={'asdf'} />}
            />
            <Route
              path="/ComponentCollabRepl"
              element={<CollabRepl roomId="1" cardId="2" />}
            />
            <Route path="/" element={<Room markdownId="1" roomId="0" />} />
            <Route path="/lobbyNewRoom" element={<LobbyNewRoom />} />
            <Route path="/lobbyJoinRoom" element={<LobbyJoinRoom />} />

            <Route path="/room/:markdownId/:roomId" element={<Wrapper />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
