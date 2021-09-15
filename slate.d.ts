// TypeScript users only add this code
import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomElement = { children: CustomText[]; type: 'paragraph' | 'code' };
type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
