import { EditorElement } from './type';

const getContentData = (htmlString: string): EditorElement =>
  // TODO: Bold, italic, underline 적용
  ({
    type: 'paragraph',
    data: [
      {
        content: htmlString,
      },
    ],
  });

const getImageData = (htmlString: string): EditorElement => {
  // TODO: alt tag 적용
  const imgRex = /<img.*?src="(.*?)"[^>]+>/g;
  const src = imgRex.exec(htmlString)?.[1] || '';

  return {
    type: 'image',
    data: [
      {
        alt: 'episode-1',
        src,
      },
    ],
  };
};

const setEditorData = (node: Node) => {
  const { firstChild, nextSibling } = node;

  if (firstChild) {
    setEditorData(firstChild);
  }

  if (nextSibling) {
    setEditorData(nextSibling);
  }
};

export const convertHTMLtoEditorData = (node: Node) => {
  const { parentNode, firstChild, nodeName, nextSibling } = node;

  // if (nodeName === tagName && parentNode && node.firstChild && ancestorHasTag) {
  //   parentNode?.replaceChild(node.firstChild, node);
  // }

  if (firstChild) {
    setEditorData(firstChild);
  }
};
