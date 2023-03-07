import React, { useEffect, useState } from 'react';
import styles from './Markdown.module.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import './global.css';

const Markdown = ({ markdown }: { [key: string]: string }) => {
  return (
    <div className={`markdown ${styles.markdownContainer}`}>
      <ReactMarkdown rehypePlugins={[rehypeRaw]} children={markdown} />
    </div>
  );
};

export default Markdown;
