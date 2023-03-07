import Markdown from './Markdown';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { actionSetField as markdownActionCreator } from '../../redux/slices/markdownSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const Container = ({ markdownId = '1' }) => {
  const dispatch = useDispatch();
  const markdownStr = useSelector((state: RootState) => state.markdown.str);
  // On mount, get markdown (pk=1) from server
  // This markdown should be the introduction (ie, about code-collab, links to collections)
  // We need to be careful that pk=1 is the introduction markdown
  useEffect(() => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `/api/markdown/${markdownId}`,
    }).then((res) => {
      interface MarkdownType {
        _id: number;
        str: string;
      }

      const data: MarkdownType = res.data;
      dispatch(markdownActionCreator({ field: '_id', value: data._id }));
      dispatch(markdownActionCreator({ field: 'str', value: data.str }));
    });
  }, []);

  return (
    <>
      <Markdown markdown={markdownStr} />
    </>
  );
};

export default Container;
