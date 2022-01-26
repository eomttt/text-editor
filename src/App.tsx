import { Editor as CustomEditor } from 'components/custom/Editor';
import { Editor as DraftEditor } from 'components/draft/Editor';
import { Editor as SlateEditor } from 'components/slate/Editor';
import { Editor as TiptapEditor } from 'components/tiptap/Editor';
import React from 'react';
import './App.css';

const App = () => (
  <>
    <h1>Custom Editor</h1>
    <CustomEditor />

    <h1>Slate Editor</h1>
    <SlateEditor />

    <h1>Draft Editor</h1>
    <DraftEditor />

    <h1>TipTap Editor</h1>
    <TiptapEditor />
  </>
);

export default App;
