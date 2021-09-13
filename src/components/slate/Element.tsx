/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { RenderElementProps } from 'slate-react';

export const Element = ({ attributes, children, element }: RenderElementProps) => {
  if (element.type === 'code') {
    return (
      <pre {...attributes}>
        <code>{children}</code>
      </pre>
    );
  }

  return <p {...attributes}>{children}</p>;
};
