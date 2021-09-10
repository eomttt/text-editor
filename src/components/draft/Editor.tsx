import { Editor as DraftEditor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import React, { MouseEvent, useCallback, useState } from 'react';

export const Editor = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const handleClickBold = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
    },
    [editorState],
  );

  return (
    <>
      <button type="button" onMouseDown={handleClickBold}>
        B
      </button>
      <div style={{ border: '1px solid black', minHeight: '50px' }}>
        <DraftEditor editorState={editorState} onChange={setEditorState} />
      </div>
    </>
  );
};
