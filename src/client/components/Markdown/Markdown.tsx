import React, { useEffect, useState } from 'react';
import styles from './Markdown.module.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Markdown = ({ markdown }: { [key: string]: string }) => {
  return (
    <div className={styles.markdownContainer}>
      <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
    </div>
  );
};

export default Markdown;
