## Step-by-step walkthrough of how CollabCodeEditor works

component renders
changed: view, initialTextSet
useEffect "setInitialText" fires and shortcircuts because view is undefined

DOM renders
useEffect "setEditorView" fires because editor htmlElement changed
and sets editor

Editor set
useEffect "setInitialText" fires.
Three shortcircuit checks: editor set (yes, pass)
does editor have text (no, pass)
do we have initial text (no, fail!)

Parent sets initial text finally (from redux)
useEffect "setInitialText" fires.
Three shortcircuit checks: editor set (yes, pass)
does editor have text (no, pass)
do we have initial text (yes, fail!)
editor text updated

ytext set

editorView set --> dispatch
editorView text mutates

## Useful code snippets:

```
    // if you want to use updateListenerExtension, it needs to be included as an extension in CodeMirror
    let updateListenerExtension = EditorView.updateListener.of((update) => {
        // only update when the text changes
        // note that listener fires for all changes, including clicks and cursor movement which does not change text
        if (update.docChanged) {
            const text = update.state.doc.toString();
            cbSetText(text)
            console.log('CollaborativeEditor detecting text change: ', text)
        }
    });

    ytext.observe(event => {
        console.log('ytext  modified to ', ytext.toString())
        console.log('ytext  modified to ', ytext.toString())

      })

    console.log(ydoc.clientID)

    //Example ytext operations
    ytext.insert(0, 'abc') // insert three elements
    ytext.format(1, 2, { bold: true }) // delete second element
    ytext.toString() // => 'abc'
    ytext.toDelta() // => [{ insert: 'a' }, { insert: 'bc', attributes: { bold: true }}]


```

## TODO

consider refactoring CodeEditor and CollabCodeEditor to reduce redundant code
