import { Editor as TiptapEditor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import React from 'react';
import classNames from 'classnames';
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
        strike
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
    </>
  );
};
