import Bold from '@tiptap/extension-bold';
import Dropcursor from '@tiptap/extension-dropcursor';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { Editor as TiptapEditor, EditorContent, useEditor } from '@tiptap/react';
import { Slice, Fragment, Node, ResolvedPos } from 'prosemirror-model';
import StarterKit from '@tiptap/starter-kit';
import classNames from 'classnames';
import { DownloadBtn, getJSONStringify } from 'components/DownloadBtn';
import React from 'react';
import Styles from './Editor.css';

const MenuBar = ({ editor }: { editor: TiptapEditor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={classNames([editor.isActive('bold') && Styles.isActive])}
      >
        bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={classNames([editor.isActive('italic') && Styles.isActive])}
      >
        italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={classNames([editor.isActive('underline') && Styles.isActive])}
      >
        underline
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={classNames([editor.isActive('strike') && Styles.isActive])}
      >
        strikethrough
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('URL');

          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
      >
        Add image url
      </button>
    </>
  );
};

export const Editor = () => {
  function clipboardTextParser(text: string, context: ResolvedPos) {
    const blocks = text.split(/(?:\r\n?|\n)/);
    const nodes: Node[] = blocks.reduce((acc: Node[], cur: string) => {
      const nodeJson: { [key: string]: any } = { type: 'paragraph' };
      if (cur.length > 0) {
        nodeJson.content = [{ type: 'text', text: cur }];
      }
      const node = Node.fromJSON(context.doc.type.schema, nodeJson);
      acc.push(node);
      return acc;
    }, []);

    return Slice.maxOpen(Fragment.fromArray(nodes));
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Bold.configure({
        HTMLAttributes: { class: Styles.boldAttribute },
      }),
      Image,
      Dropcursor,
    ],
    content: '<p>Hello World! 🌎️</p>',
    editorProps: {
      clipboardTextParser,
    },
  });

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent className={Styles.editor} editor={editor} />
      <DownloadBtn value={editor?.getJSON()} fileName="tiptap.json" />
      <pre>{getJSONStringify(editor?.getJSON())}</pre>
    </>
  );
};
