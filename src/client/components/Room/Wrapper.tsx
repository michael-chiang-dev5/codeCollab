// The purpose of this component is to pass react-router params to room

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Room from './Room';

const Wrapper = () => {
  const { markdownId, roomid } = useParams();
  console.log('in wrapper');
  return (
    <>
      <Room markdownId={markdownId} roomid={roomid} />;
    </>
  );
};

export default Wrapper;
