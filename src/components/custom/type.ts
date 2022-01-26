export type ElementType = 'paragraph' | 'image';
export type StyleType = 'bold' | 'italic' | 'underline';
export type AlignType = 'left' | 'center' | 'right' | 'justify';

export interface EditorContentData {
  style?: StyleType[];
  content: string;
}

export interface EditorImageData {
  alt: string;
  src: string;
}

export interface EditorElementData {
  type: ElementType;
  align?: AlignType;
  data: (EditorContentData | EditorImageData)[];
}
