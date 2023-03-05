import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

// These imports are used for codemirror editor
import { EditorView, lineNumbers } from '@codemirror/view'; // Do not
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';
import { foldGutter } from '@codemirror/language';

// themes for codemirror
import { createDarkTheme } from './solarizedDarkTheme';
import { createThemeLight } from './solarizedLightTheme';

const CodeEditor = ({
  readOnly = false,
  initialText = '',
  hidden = false,
  theme = 'dark',
  cb = (text: string) => {},
  minHeight = 0,
}) => {
  const editor = useRef<HTMLDivElement>(null);

  const [view, setView] = useState();

  useEffect(
    () => {
      let updateListenerExtension = EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const text = update.state.doc.toString();
          cb(text);
        }
      });

      // Create the editor
      const state = EditorState.create({
        doc: initialText,
        extensions: [
          theme === 'dark'
            ? createDarkTheme(minHeight)
            : createThemeLight(minHeight),
          lineNumbers(),
          foldGutter({
            closedText: '▶',
            openText: '▼',
          }),
          javascript(),
          EditorView.lineWrapping,
          EditorState.readOnly.of(readOnly),
          updateListenerExtension,
        ],
      });

      // attach editor view to element
      const editorView = new EditorView({
        state,
        parent: editor.current as Element,
      });

      return () => {
        if (editorView) editorView.destroy();
      };
      // Imporntant concept:
      // If the editor accepts user input, then we only create the editor once and do not re-create when initial text changes
      // If the editor is readonly, the we recreate the editor any change to the text
    },
    readOnly ? [editor, initialText] : [editor]
  );

  return (
    <>
      <div
        ref={editor}
        className="MCEditor"
        style={hidden ? { display: 'none' } : { display: 'block' }}
      ></div>
    </>
  );
};

export default CodeEditor;
