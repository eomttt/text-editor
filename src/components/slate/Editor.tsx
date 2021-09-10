/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useMemo, useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react';
import { EditorHelper } from 'components/slate/EditorHelper';

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
          onMouseDown={event => {
            event.preventDefault();
            EditorHelper.toggleBoldMark(editor);
          }}
        >
          B
        </button>
        <button
          type="button"
          onMouseDown={event => {
            event.preventDefault();
            EditorHelper.toggleCodeBlock(editor);
          }}
        >
          Code Block
        </button>
      </div>
      <Editable
        style={{ border: '1px solid black', minHeight: '50px' }}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
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
              EditorHelper.toggleBoldMark(editor);
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

const CodeElement = (props: RenderElementProps) => (
  <pre {...props.attributes}>
    <code>{props.children}</code>
  </pre>
);

const DefaultElement = (props: RenderElementProps) => <p {...props.attributes}>{props.children}</p>;

const renderElement = (props: RenderElementProps) => {
  switch (props.element.type) {
    case 'code':
      return <CodeElement {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  return <span {...attributes}>{children}</span>;
};

const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;
