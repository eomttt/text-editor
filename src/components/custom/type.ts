export type EditorElementType = 'paragraph' | 'image';
export type EditorAlignType = 'left' | 'right' | 'center' | 'justify';
export type EditorAnnotationType = 'bold' | 'italic' | 'underline';

export interface EditorImageData {
  alt: string;
  src: string;
}

export interface EditorParagraphData {
  content: string;
  annotations?: Record<EditorAnnotationType, boolean>;
}

export interface EditorElement {
  type: EditorElementType;
  align?: EditorAlignType;
  data: (EditorParagraphData | EditorImageData)[];
}
