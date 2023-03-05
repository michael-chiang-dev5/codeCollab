import React from 'react';
import styles from './App.module.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { defaultMethod } from 'react-router-dom/dist/dom';
import { v4 as uuid } from 'uuid';
import Room from '../Room/Room';

// These are the left items on the navbar
const leftItems = {
  library: '/room',
  rooms: '/room',
};

function App() {
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
              <a href={`/auth/google`}>log in</a>
            </div>
          </div>
        </div>
        <div>
          <Routes>
            <Route path="/room" element={<Room />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
