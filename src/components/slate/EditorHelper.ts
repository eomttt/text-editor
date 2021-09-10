import { BaseEditor, Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

export class EditorHelper {
  private static isMarkActive(editor: BaseEditor & ReactEditor, format: 'bold') {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  }

  private static isBlockActive(editor: BaseEditor & ReactEditor, format: string) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === format,
    });

    return !!match;
  }

  static toggleBoldMark(editor: BaseEditor & ReactEditor) {
    const isActive = this.isMarkActive(editor, 'bold');

    if (isActive) {
      Editor.removeMark(editor, 'bold');
    } else {
      Editor.addMark(editor, 'bold', true);
    }
  }

  static toggleCodeBlock(editor: BaseEditor & ReactEditor) {
    // Determine whether any of the currently selected blocks are code blocks.
    const isMatch = this.isBlockActive(editor, 'code');
    Transforms.setNodes(editor, { type: isMatch ? 'paragraph' : 'code' }, { match: n => Editor.isBlock(editor, n) });
  }
}
