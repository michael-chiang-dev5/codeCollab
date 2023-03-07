import Markdown from './Markdown';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Container = () => {
  useEffect(() => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `/api/markdown/1`,
    }).then((res) => {
      console.log(res.data);
    });
  }, []);

  return (
    <>
      <Markdown markdown="asdf" />
    </>
  );
};

export default Container;
