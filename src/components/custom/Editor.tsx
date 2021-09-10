/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { TextType } from 'components/custom/Buttons';
import React, { FormEvent, useCallback, KeyboardEvent, useMemo, useRef, useState, useEffect } from 'react';
import Styles from './Editor.css';

const StyleMap = {
  [TextType.BOLD]: Styles.bold,
  [TextType.ITALIC]: Styles.italic,
  [TextType.UNDERLINE]: Styles.underline,
  [TextType.STRIKETHROUGH]: Styles.strikethrough,
};

interface EditorProps {
  activeButtons: TextType[];
}

export const Editor = ({ activeButtons }: EditorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [beforeText, setBeforeText] = useState('');
  const [text, setText] = useState('');
  const [boldStart, setBoldStart] = useState(false);
  const [isShowPlaceholder, setIsShowPlaceholder] = useState(true);

  const editorStyles = useMemo(() => activeButtons.map(button => StyleMap[button]), [activeButtons]);

  const setFocus = useCallback(() => ref?.current?.focus(), []);

  const handleBlur = useCallback(() => {
    console.log('blur');
  }, []);

  const handleFocus = useCallback(() => {
    console.log('ref', ref?.current);
  }, []);

  const handleInput = useCallback((e: FormEvent<HTMLDivElement>) => {
    const value = (e.target as HTMLElement).innerHTML;

    setBeforeText(value);
    setText(value);
    setIsShowPlaceholder(!value);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;

    console.log('key', key);
  }, []);

  useEffect(() => {
    if (activeButtons.includes(TextType.BOLD)) {
      document.execCommand('bold');
    }
  }, [activeButtons]);

  return (
    <div className={Styles.container}>
      <div className={classNames([Styles.shower, Styles.common])} dangerouslySetInnerHTML={{ __html: text }} />
      <div onClick={setFocus} className={classNames([Styles.placeholder, !isShowPlaceholder && Styles.hide])}>
        I am placeholder
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className={classNames([Styles.editor, Styles.common])}
        aria-multiline
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onInput={handleInput}
      >
        <p>
          <br />
        </p>
      </div>
    </div>
  );
};
