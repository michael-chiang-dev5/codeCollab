import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { actionSetField as markdownActionCreator } from '../../redux/slices/markdownSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Container from '../Markdown/Container';
import CollabRepl from '../CollabRepl/CollabRepl';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  return (
    <>
      <div className={styles.row}>
        <div>
          <Container />
        </div>
        <div>
          <CollabRepl />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
