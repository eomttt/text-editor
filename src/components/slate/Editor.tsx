/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-use-before-define */
import classNames from 'classnames';
import { DownloadBtn, getJSONStringify } from 'components/DownloadBtn';
import { EditorHelper } from 'components/slate/EditorHelper';
import { Element } from 'components/slate/Element';
import { Leaf } from 'components/slate/Leaf';
import React, { useMemo, useState } from 'react';
import { BaseEditor, createEditor, Descendant } from 'slate';
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react';
import Styles from './Editor.css';

const MenuBar = ({ editor }: { editor: (BaseEditor & ReactEditor) | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className={classNames(EditorHelper.isMarkActive(editor, 'bold') && Styles.isActive)}
        onMouseDown={event => {
          event.preventDefault();
          EditorHelper.toggleMark(editor, 'bold');
        }}
      >
        bold
      </button>
      <button
        type="button"
        className={classNames(EditorHelper.isMarkActive(editor, 'italic') && Styles.isActive)}
        onMouseDown={event => {
          event.preventDefault();
          EditorHelper.toggleMark(editor, 'italic');
        }}
      >
        italic
      </button>
      <button
        type="button"
        className={classNames(EditorHelper.isMarkActive(editor, 'underline') && Styles.isActive)}
        onMouseDown={event => {
          event.preventDefault();
          EditorHelper.toggleMark(editor, 'underline');
        }}
      >
        underline
      </button>
      <button
        type="button"
        className={classNames(EditorHelper.isMarkActive(editor, 'strikethrough') && Styles.isActive)}
        onMouseDown={event => {
          event.preventDefault();
          EditorHelper.toggleMark(editor, 'strikethrough');
        }}
      >
        strikethrough
      </button>
    </>
  );
};

export const Editor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: 'Hello World! 🌎️' }],
    },
  ]);

  // Render the Slate context.
  return (
    <>
      <MenuBar editor={editor} />
      <Slate editor={editor} value={value} onChange={newValue => setValue(newValue)}>
        <Editable
          className={Styles.editor}
          renderElement={(props: RenderElementProps) => <Element {...props} />}
          renderLeaf={(props: RenderLeafProps) => <Leaf {...props} />}
          onKeyDown={event => {
            if (!event.ctrlKey) {
              return;
            }

            switch (event.key) {
              case '`': {
                event.preventDefault();
                EditorHelper.toggleCodeBlock(editor);
                break;
              }
              case 'b': {
                event.preventDefault();
                EditorHelper.toggleMark(editor, 'bold');
                break;
              }
              default: {
                break;
              }
            }
          }}
        />
      </Slate>
      <DownloadBtn value={value} fileName="slate.json" />
      <pre>{getJSONStringify(value)}</pre>
    </>
  );
};
