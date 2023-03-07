import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RootState } from '../../redux/store';

/*
Note:
Do not use '@codemirror/basic-setup' to import basicSetup, EditorView
Instead, import basicSetup from 'codemirror' and Editorview fromr '@codemirror/view'
'@codemirror/basic-setup' has a different version of @codemirror/state that causes conflicts. 
This took me a long time to figure out *sadface*
*/

// These imports are used for codemirror editor
import { EditorView, lineNumbers } from '@codemirror/view'; // Do not
import { basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';
import { foldGutter } from '@codemirror/language';

// These imports are used for adding collaborative functionality to editor
import * as Y from 'yjs';
import { yCollab } from 'y-codemirror.next';
import { WebrtcProvider } from 'y-webrtc';
import { useSelector } from 'react-redux';

// These are colors to mark different users
const usercolors = [
  { color: '#30bced', light: '#30bced33' },
  { color: '#6eeb83', light: '#6eeb8333' },
  { color: '#ffbc42', light: '#ffbc4233' },
  { color: '#ecd444', light: '#ecd44433' },
  { color: '#ee6352', light: '#ee635233' },
  { color: '#9ac2c9', light: '#9ac2c933' },
  { color: '#8acb88', light: '#8acb8833' },
  { color: '#1be7ff', light: '#1be7ff33' },
];

// themes for codemirror
import { createDarkTheme } from './solarizedDarkTheme';
import { createThemeLight } from './solarizedLightTheme';
// https://discuss.codemirror.net/t/code-editor-with-automatic-height-that-has-a-minimum-and-maximum-height/4015/3

/*
CollabCodeEditor parameters
    editorID    : suppose editor1 with editorID='asdf' is rendered for peer1. If an editor2 with 
                  editorId='asdf' is rendered for peer2, then editor1 and editor2 will share text
                  via CRDTs.
    cb          : the editor will execute this callback whenever its text is changed (by any peer).
                  This is used to pass text back to parent
    readOnly    : disables text editing
    initialText : the editor will replace its current text with initialText if re-rendered
*/
const CollabCodeEditor = ({
  editorID = 'default-room-name',
  cb = (text: string) => {},
  readOnly = false,
  initialText = '',
  hidden = false,
  theme = 'dark',
  minHeight = '0',
}) => {
  // WHAT: picks a random color to denote user in collaborative editor
  const userColor =
    usercolors[Math.floor(100 * Math.random()) % usercolors.length];

  // WHAT: 'editor 'is a pointer to the DOM element where we want to mount
  //       the codemirror editor. 'editor' updates once the DOM is mounted
  //       and triggers the useEffect hook that creates the actual
  //       codemirror editor
  // HOW: useRef has multiple functions. One of these functions is to
  //      access the DOM via the 'ref' react-dom attribute. When the
  //      DOM mounts, editor will update from null to point at the DOM
  //      element.
  // FURTHER READING: https://dmitripavlutin.com/react-useref-guide/
  const editor = useRef<HTMLDivElement>(null);

  // WHAT: getters and setters for view is the editor view
  // WHY:  Editor view is used to change text within the editor programmatically
  //       We define view here in the top-level instead of with the rest of the editor code because parent passes text to component
  //       via prop 'initialText' and we need to re-render component when initialText changes. Hence, we have
  //       a useEffect hook and hooks must be top-level functions, so view must be a top-level variable
  //       the initial
  const [view, setView] = useState<EditorView | undefined>();

  /*
    WHAT: Create the editor and mount it to div
    HOW:  Once the DOM is mounted and 'editor' points to where we want to 
          mount the editor, we create the editor and mount it to DOM
    */
  const userData = useSelector((state: RootState) => state.user);
  // ytext is able to access the shared data type
  // You should treat ytext as the source of truth for what the text is

  // Maybe it is possible to set the initial state of the ydoc? This would save a lot of headaches
  // https://discuss.yjs.dev/t/how-to-set-intial-value-from-the-server/716/5

  // Alternatively, it is possible to wait until syncing before doing any text writing
  // provider.on('synced', () => {
  //   // you received the initial content (e.g. the empty paragraph) from the other peers
  // })
  // https://discuss.yjs.dev/t/initial-offline-value-of-a-shared-document/465/3

  // I think I should think about the difference between creating a document (and writing initial text)
  // versus loading a document (and not writing initial text).
  const ydoc = new Y.Doc();
  // Get the text from the shared type
  let ytext: Y.Text;
  useEffect(() => {
    ytext = ydoc.getText('codemirror');
  }, []);

  useEffect(() => {
    // Initializes the shared type 'ydoc'.
    // WHAT: connect shared type 'ydoc' to peers with the magic of webrtc
    // HOW: signaling server implemented in node_modules/y-webrtc/bin/server.js.
    //      For some reason, the sinaling server doens't work if accessed from different
    //      browsers when run with node; for now, we run as a module.
    const provider = new WebrtcProvider(editorID, ydoc, {
      signaling: [process.env.EDITOR_SIGNAL_SERVER_URL],
    });
    provider.awareness.setLocalStateField('user', {
      name: userData.email,
      color: userColor.color,
      colorLight: userColor.light,
    });

    // TODO: move this elsewhere
    // When the text changes in the editor (whether changed by yourself or a peer), fire
    // the callback in order to do something interesting with the changed text.
    let updateListenerExtension = EditorView.updateListener.of((update) => {
      // note that listener fires for all changes, including clicks and cursor movement
      // which does not change text. Therefore, filter for when the doc itself has changed.
      if (update.docChanged) {
        const text = update.state.doc.toString();
        cb(text);
        // console.log('CollaborativeEditor detecting text change: ', text)
      }
    });

    // Create the editor
    const undoManager = new Y.UndoManager(ytext); // Functionality to undo text in yjs
    const state = EditorState.create({
      doc: ytext.toString(), // initialize the editor with whatever text is in the distributed CRDT
      extensions: [
        theme === 'dark'
          ? createDarkTheme(minHeight)
          : createThemeLight(minHeight),
        lineNumbers(),
        foldGutter({
          closedText: '▶',
          openText: '▼',
        }),
        // basicSetup,
        javascript(),
        yCollab(ytext, provider.awareness, { undoManager }),
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
    setView(editorView);

    // WHY: give top-level functions access to view, and force a re-render
    //      Re-render is needed so that initial text can be set in top-level
    //      useEffect callback
    // setView(editorView);

    // return callback is executed on component un-mount
    return () => {
      if (view) view.destroy();
    };
  }, [editor]); // only create the editor and mount it on the DOM once the DOM itself is mounted

  /*
    WHAT: If you are the creator, replace text with initialText specified in props
    WHY: It is tricky to initialize a CRDT with initial text. One solution is to 
         intialize the CRDT with no text, then simulate a user typing in the initial
         text.
    FURTHER READING: https://github.com/yjs/yjs/issues/101
                     https://github.com/yjs/yjs/issues/82
    */
  useEffect(() => {
    if (!view) return;
    if (view.state.doc.length !== 0) return;
    if (initialText === '') return;
    view.dispatch({
      changes: [{ from: 0, to: view.state.doc.length, insert: initialText }],
    });
  }, [view, initialText]);

  return (
    <>
      <div
        ref={editor}
        className="CollabCodeEditor"
        // style={hidden ? { display: 'none' } : { display: 'block' }}
      ></div>
    </>
  );
};

export default CollabCodeEditor;
