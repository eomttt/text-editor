import { Editor as DraftEditor } from 'components/draft/Editor';
import { Editor as SlateEditor } from 'components/slate/Editor';
import React from 'react';
import './App.css';

const App = () => (
  <>
    <h1>Slate Editor</h1>
    <SlateEditor />

    <h1>Draft Editor</h1>
    <DraftEditor />
  </>
);

export default App;
