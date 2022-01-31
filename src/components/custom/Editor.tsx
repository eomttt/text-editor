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
import { EditorElement } from './type';

const pasteTextHandler = (clipboardData: DataTransfer) => {
  const paste = clipboardData.getData('text');
  const pTag = document.createElement('p');
  const pastedText = paste.replaceAll('\n', '<br>');
  pTag.innerHTML = pastedText;

  return pTag;
};

const TEXT_NODE_TYPE = 3;

// eslint-disable-next-line consistent-return
function getNextNode(node: Node | null) {
  if (node?.firstChild) {
    return node.firstChild as Node;
  }

  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    // eslint-disable-next-line no-param-reassign
    node = node.parentNode;
  }
  return null;
}

function getNodesInRange(range: Range) {
  const { startContainer, endContainer, commonAncestorContainer } = range;
  const nodes = [];

  let node: Node | null = startContainer.parentNode;
  // walk parent nodes from start to common ancestor
  while (node) {
    console.log('pp', node.parentNode);
    if (node.nodeType === TEXT_NODE_TYPE) {
      // modified to only add text nodes to the array
      nodes.unshift(node);
    }
    if (node === commonAncestorContainer) {
      break;
    }
    node = node.parentNode;
  }

  node = startContainer;
  // walk children and siblings from start until end is found
  while (node) {
    if (node.nodeType === TEXT_NODE_TYPE) {
      // modified to only add text nodes to the array
      nodes.push(node);
    }
    if (node === endContainer) {
      break;
    }
    node = getNextNode(node);
  }

  return nodes as Text[];
}

function styleRange(range: Range) {
  const startTextNode = (range.startContainer as Text).splitText(range.startOffset);
  const endTextNode = (range.endContainer as Text).splitText(range.endOffset).previousSibling as Text;

  if (!endTextNode) {
    return;
  }

  // // Adjust the range to contain the new start and end nodes
  // // The offsets are not really important anymore but might as well set them correctly
  range.setStart(startTextNode, 0);
  range.setEnd(endTextNode, endTextNode.length);

  // // Get an array of all text nodes within the range
  const textNodes = getNodesInRange(range) as Text[];

  // // Place strong tags with style around each textNode
  textNodes.forEach(textNode => {
    if (textNode.nodeValue && textNode.parentNode) {
      const strong = document.createElement('strong');
      strong.appendChild(document.createTextNode(textNode.nodeValue));
      textNode.parentNode.replaceChild(strong, textNode);
    }
  });
}

export const Editor = () => {
  const [state, setState] = useState<EditorElement[]>([]);

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
    // const res = window.prompt();
    // if (res && ref.current) {
    //   const p = document.createElement('p');
    //   const img = document.createElement('img');
    //   img.setAttribute('src', res);
    //   img.setAttribute('alt', 'test');
    //   p.appendChild(img);
    //   const sel = window.getSelection();
    //   const range = sel.getRangeAt(0);
    //   console.log('CHECK', sel, range);
    //   // ref.current.appendChild(p);
    //   // setState(convertHTMLtoEditorData(ref.current.innerHTML));
    // }
  };

  const handleSetBold = () => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (selection && range) {
      styleRange(range);
      // const strong = document.createElement('strong');
      // const fragment = range.extractContents();
      // strong.appendChild(fragment);
      // strong.innerHTML = strong.innerHTML.replace('<strong>', '').replace('</strong>', '');

      // const newFragment = document.createDocumentFragment();
      // newFragment.appendChild(strong);
      // console.log('newFragment', newFragment);
      // range.insertNode(newFragment);
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
      <button type="button" onClick={handleSetBold}>
        BOLD
      </button>
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
        {/* <p>
          <br />
        </p> */}
        <p>
          123<strong>456</strong>789
        </p>
        <p>123456789</p>
        <p>
          123
          <em>
            <strong>456</strong>
          </em>
          789
        </p>
      </div>
      <h1>Custom Editor Viewer</h1>
      <div ref={viewerRef} />
      <h1>JSON FORMAT</h1>
      <pre>{getJSONStringify(state)}</pre>
    </div>
  );
};
