/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-use-before-define */
import classNames from 'classnames';
import { EditorHelper } from 'components/slate/EditorHelper';
import { Element } from 'components/slate/Element';
import { Leaf } from 'components/slate/Leaf';
import React, { useMemo, useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react';
import Styles from './Editor.css';

export const Editor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]);

  // Render the Slate context.
  return (
    <Slate editor={editor} value={value} onChange={newValue => setValue(newValue)}>
      <div>
        <button
          type="button"
          className={classNames(EditorHelper.isMarkActive(editor, 'bold') && Styles.isActive)}
          onMouseDown={event => {
            event.preventDefault();
            EditorHelper.toggleMark(editor, 'bold');
          }}
        >
          B
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
      </div>
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
  );
};
