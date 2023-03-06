import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CollabCodeEditor from '../CollabCodeEditor/CollabCodeEditor';
import axios from 'axios';
import { actionSetField } from '../../redux/slices/replSlice';
import CodeEditor from '../CollabCodeEditor/CodeEditor';
import { runCode } from '../../repl/eval';
import { RootState } from '../../redux/store';
import styles from './CollabRepl.module.css';

const CollabRepl = ({ roomId, cardId }) => {
  // getters for Redux state
  // useSelector is a hook that re-renders component everything time selected value changes
  const replData = useSelector((state: RootState) => state.repl);
  const userData = useSelector((state: RootState) => state.user);

  // callbacks to update redux store
  const dispatch = useDispatch();
  const cb = (field, value) => {
    dispatch(actionSetField({ field, value }));
  };

  // standard output
  const [stdout, setStdout] = useState('');

  // This is used to toggle whether the console is shown or not
  const [showConsole, setShowConsole] = useState(false);

  return (
    <>
      <div className={styles.mainGrid}>
        {/* code editor for card "prompt" */}
        <div className={`${styles.prompt}`}>
          <CollabCodeEditor
            minHeight={300}
            editorID={`prompt-${roomId}-${cardId}`}
            initialText={''}
            theme="light"
            cb={(e) => cb('text', e)}
          />
        </div>

        <div
          id="stdout"
          className={`${styles.consoleArea} ${styles.zIndex20}`}
          style={showConsole ? { display: 'block' } : { display: 'none' }}
        >
          <div>
            <CodeEditor
              minHeight={150}
              initialText={stdout}
              theme="dark"
              readOnly={true}
            />
          </div>
        </div>

        <div id="console-bar" className={`${styles.console}`}>
          <div
            className={`${styles.consoleButton} ${styles.cursor}`}
            onClick={() => {
              const output = runCode(replData.text);
              // stdOut holds what will be displayed
              if (output.stderr !== '') setStdout(output.stderr);
              else setStdout(output.stdout);
              setShowConsole(true);
            }}
          >
            run
          </div>

          {/* Toggles the console on and off */}
          <div
            className={`${styles.consoleButton}  ${styles.cursor}`}
            onClick={() => {
              if (showConsole) setShowConsole(false);
              else setShowConsole(true);
            }}
          >
            console
          </div>
        </div>
      </div>
      <div className={styles.column}>
        <div className={`${styles.row} ${styles.width50}`}></div>
      </div>
      {/* end column */}
    </>
  );
};

export default CollabRepl;
