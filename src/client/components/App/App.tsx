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

// These are the left items on the navbar
const leftItems = {
  library: '/room',
  rooms: '/room',
};

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
          const data = res.data;
          // Output of console.log(data);
          //    { "_id": 1,
          //      "sub": "117477940901052965444",
          //      "picture": "https://lh3.googleusercontent.com/a/default-user=s96-c",
          //      "email": "michael.chiang.mc5@gmail.com",
          //      "email_verified": true}
          dispatch(actionSetField({ field: 'sub', value: data.sub }));
          dispatch(actionSetField({ field: 'picture', value: data.picture }));
          dispatch(actionSetField({ field: 'email', value: data.email }));
          dispatch(actionSetField({ field: '_id', value: data._id }));
        }
      })
      .catch((err) => console.log(err));
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
                  <Link to={url}>{title}</Link>
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
            <Route path="/room" element={<CollabCodeEditor />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
