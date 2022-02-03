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

// 자식의 중복 tag 있으면 제거
const flattenChild = (node: Node, tagName: string, ancestorHasTag = false) => {
  const { parentNode, firstChild, nodeName, nextSibling } = node;

  if (nodeName === tagName && parentNode && node.firstChild && ancestorHasTag) {
    parentNode?.replaceChild(node.firstChild, node);
  }

  if (firstChild) {
    flattenChild(firstChild, tagName, ancestorHasTag || nodeName === tagName);
  }

  if (nextSibling) {
    flattenChild(nextSibling, tagName, ancestorHasTag);
  }
};

function styleRange(range: Range, tagName: string) {
  const startTextNode = (range.startContainer as Text).splitText(range.startOffset);
  const endTextNode = (range.endContainer as Text).splitText(range.endOffset).previousSibling as Text;

  if (!endTextNode) {
    return;
  }

  range.setStart(startTextNode, 0);
  range.setEnd(endTextNode, endTextNode.length);

  const textNodes = getNodesInRange(range) as Text[];

  textNodes.forEach(textNode => {
    if (textNode.nodeValue && textNode.parentNode) {
      const strong = document.createElement(tagName);
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
    const res = window.prompt();
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    if (res && ref.current && range) {
      const img = document.createElement('img');
      img.setAttribute('src', res);
      img.setAttribute('alt', 'test');

      // 커서가 위치한 영역 뒤에 이미지 삽입
      let imageSiblingNode: Node = range.startContainer;
      while (imageSiblingNode.nodeName !== 'P') {
        imageSiblingNode = imageSiblingNode.parentNode as Node;
      }
      imageSiblingNode.parentNode?.insertBefore(img, imageSiblingNode.nextSibling);
    }
  };

  const handleSetItalic = () => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (selection && range && ref.current?.firstChild) {
      styleRange(range, 'EM');
      flattenChild(ref.current.firstChild, 'EM');
      // TODO: 커서 위치
      selection.setPosition(range.startContainer);
    }
  };

  const handleSetBold = () => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (selection && range && ref.current?.firstChild) {
      styleRange(range, 'STRONG');
      flattenChild(ref.current.firstChild, 'STRONG');
      // TODO: 커서 위치
      selection.setPosition(range.startContainer);
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
      <button type="button" onClick={handleSetBold}>
        BOLD
      </button>
      <button type="button" onClick={handleSetItalic}>
        ITALIC
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
          <em>
            <strong>123</strong>
          </em>
          <strong>456</strong>
          789
        </p>
        <p>123456789</p>
        <p>
          123
          <strong>
            <em>456</em>
          </strong>
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
