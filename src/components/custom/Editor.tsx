/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { getJSONStringify } from 'components/DownloadBtn';
import React, { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { convertHTMLtoEditorData } from './convertToEditorData';
import { convertEditorDataToHTML } from './convertToHTML';
import Styles from './Editor.css';
import { EditorElementData } from './type';

const pasteTextHandler = (clipboardData: DataTransfer) => {
  const paste = clipboardData.getData('text');
  const pTag = document.createElement('p');
  const pastedText = paste.replaceAll('\n', '<br>');
  pTag.innerHTML = pastedText;

  return pTag;
};

export const Editor = () => {
  const [state, setState] = useState<EditorElementData[]>([]);

  const ref = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleInput = useCallback((e: FormEvent<HTMLDivElement>) => {
    const value = (e.target as HTMLElement).innerHTML;
    setState(convertHTMLtoEditorData(value));
  }, []);

  const handleKeyDown = useCallback((evt: KeyboardEvent<HTMLDivElement>) => {
    if (evt.key === 'Backspace') {
      if ((evt.target as HTMLElement).innerHTML === '<p><br></p>') {
        evt.preventDefault();
        evt.stopPropagation();
      }
    }
  }, []);

  const handleUploadImage = () => {
    const res = window.prompt();
    if (res && ref.current) {
      const p = document.createElement('p');
      const img = document.createElement('img');
      img.setAttribute('src', res);
      img.setAttribute('alt', 'test');
      p.appendChild(img);
      ref.current.appendChild(p);
      setState(convertHTMLtoEditorData(ref.current.innerHTML));
    }
  };

  useEffect(() => {
    if (viewerRef.current) {
      console.log('convertHTMLtoEditorData', state);
      convertEditorDataToHTML(viewerRef.current, state);
    }
  }, [state]);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('paste', event => {
        if (ref.current && event.clipboardData) {
          const pastedTag = pasteTextHandler(event.clipboardData);
          ref.current.appendChild(pastedTag);
          window.getSelection()?.setBaseAndExtent(pastedTag, 0, pastedTag, pastedTag.childNodes.length);
          setState(convertHTMLtoEditorData(ref.current.innerHTML));
        }

        event.preventDefault();
        return undefined;
      });
    }
  }, []);

  return (
    <div className={Styles.container}>
      {/* <button type="button" onClick={handleClickBold}>
        BOLD
      </button>
      <button type="button">ITALIC</button>
      <button type="button">UNDERLINE</button> */}
      <button type="button" onClick={handleUploadImage}>
        IMAGE
      </button>
      <div
        id="editor"
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className={classNames([Styles.editor, Styles.common])}
        aria-multiline
        onKeyDown={handleKeyDown}
        onInput={handleInput}
      >
        <p>
          <br />
        </p>
      </div>
      <h1>Custom Editor Viewer</h1>
      <div ref={viewerRef} />
      <h1>JSON FORMAT</h1>
      <pre>{getJSONStringify(state)}</pre>
    </div>
  );
};
