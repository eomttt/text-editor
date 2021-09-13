import { Editor, Transforms, Element } from 'slate';

type MarkType = 'bold' | 'italic' | 'underline' | 'strikethrough';
export class EditorHelper {
  static isMarkActive(editor: Editor, format: MarkType) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  }

  static isBlockActive(editor: Editor, format: string) {
    const [match] = Editor.nodes(editor, {
      // For ts Element.isElement(n)
      match: n => Element.isElement(n) && n.type === format,
    });

    return !!match;
  }

  static toggleMark(editor: Editor, type: MarkType) {
    if (this.isMarkActive(editor, type)) {
      Editor.removeMark(editor, type);
    } else {
      Editor.addMark(editor, type, true);
    }
  }

  static toggleCodeBlock(editor: Editor) {
    // Determine whether any of the currently selected blocks are code blocks.
    Transforms.setNodes(
      editor,
      { type: this.isBlockActive(editor, 'code') ? 'paragraph' : 'code' },
      { match: n => Editor.isBlock(editor, n) },
    );
  }
}
