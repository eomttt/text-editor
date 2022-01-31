export type ElementType = 'paragraph' | 'image';
export type AlignType = 'left' | 'center' | 'right' | 'justify';
export type ContentAnnotationType = 'bold' | 'italic' | 'underline';

export interface EditorContentData {
  content: string;
  href?: string;
  annotations?: Record<ContentAnnotationType, boolean>;
}

export interface EditorImageData {
  alt: string;
  src: string;
}

export interface EditorElement {
  type: ElementType;
  align?: AlignType;
  data: (EditorContentData | EditorImageData)[];
}
