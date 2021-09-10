import classNames from 'classnames';
import { Button } from 'components/custom/Button';
import React, { useCallback } from 'react';
import Styles from './Button.css';

interface ButtonsProps {
  activeButtons: TextType[];
  onClick: (type: TextType) => void;
}

export enum TextType {
  BOLD = 'BOLD',
  ITALIC = 'ITALIC',
  UNDERLINE = 'UNDERLINE',
  STRIKETHROUGH = 'STRIKETHROUGH',
  // ORDERED_LIST = 'ORDERED_LIST',
  // UNORDERED_LIST = 'UNORDERED_LIST',
}

const ButtonText = {
  [TextType.BOLD]: 'B',
  [TextType.ITALIC]: 'I',
  [TextType.UNDERLINE]: 'U',
  [TextType.STRIKETHROUGH]: 'S',
  // [TextType.ORDERED_LIST]: 'OL',
  // [TextType.UNORDERED_LIST]: 'UL',
};

export const Buttons = ({ activeButtons, onClick }: ButtonsProps) => {
  const isActive = useCallback((buttonType: TextType) => activeButtons.includes(buttonType), [activeButtons]);

  return (
    <>
      {Object.values(TextType).map(type => (
        <Button
          key={type}
          className={classNames([isActive(type) && Styles.isActive])}
          type="button"
          onClick={() => onClick(type)}
        >
          {ButtonText[type]}
        </Button>
      ))}
    </>
  );
};
