import { Buttons, TextType } from 'components/custom/Buttons';
import { Editor } from 'components/custom/Editor';
import { Editor as SlateEditor } from 'components/slate/Editor';
import { Editor as DraftEditor } from 'components/draft/Editor';
import React, { useCallback, useState } from 'react';
import './App.css';

const App = () => {
  const [activeButtons, setActiveButtons] = useState<TextType[]>([]);

  const handleClick = useCallback(
    (type: TextType) => {
      if (activeButtons.includes(type)) {
        setActiveButtons(prev => prev.filter(prevType => prevType !== type));
        return;
      }
      setActiveButtons(prev => [...prev, type]);
    },
    [activeButtons],
  );

  return (
    <>
      <h1>Eomttt Editor</h1>
      <Buttons activeButtons={activeButtons} onClick={handleClick} />
      <Editor activeButtons={activeButtons} />

      <h1>Slate Editor</h1>
      <SlateEditor />

      <h1>Draft Editor</h1>
      <DraftEditor />
    </>
  );
};

export default App;
