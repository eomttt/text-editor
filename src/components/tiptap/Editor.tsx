import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import { Editor as TiptapEditor, EditorContent, useEditor } from '@tiptap/react';
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
    </>
  );
};

export const Editor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Bold.configure({
        HTMLAttributes: { class: Styles.boldAttribute },
      }),
    ],
    content: '<p>Hello World! 🌎️</p>',
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
