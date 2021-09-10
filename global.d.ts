// TypeScript users only add this code
import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

declare module '*.css';

type CustomElement = { type: 'paragraph' | 'code'; children: CustomText[] };
type CustomText = { text: string; bold?: boolean };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
