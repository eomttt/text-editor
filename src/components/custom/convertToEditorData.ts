import { EditorElementData } from './type';

const getContentData = (htmlString: string): EditorElementData =>
  // TODO: Bold, italic, underline 적용
  ({
    type: 'paragraph',
    data: [
      {
        content: htmlString,
      },
    ],
  });
const getImageData = (htmlString: string): EditorElementData => {
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

export const convertHTMLtoEditorData = (htmlString: string): EditorElementData[] => {
  const arr = htmlString.match(/<p>([^]*?)<\/p>/g);

  if (!arr) {
    return [];
  }

  return arr.reduce<EditorElementData[]>((acc, cur) => {
    const innerHTML = cur.replaceAll('<p>', '').replaceAll('</p>', '').replaceAll('<br>', '\n');
    const type = innerHTML.includes('<img') ? 'image' : 'paragraph';

    return type === 'image' ? [...acc, getImageData(innerHTML)] : [...acc, getContentData(innerHTML)];
  }, []);
};
