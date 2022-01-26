type ElementType = 'paragraph' | 'image';
type StyleType = 'bold' | 'italic' | 'underline';
type AlignType = 'left' | 'center' | 'right' | 'justify';

interface EditorContentData {
  style?: StyleType[];
  content: string;
}

interface EditorImageData {
  alt: string;
  src: string;
}

export interface EditorElementData {
  type: ElementType;
  align?: AlignType;
  data: (EditorContentData | EditorImageData)[];
}

const editorElement: EditorElementData[] = [
  {
    type: 'paragraph',
    data: [
      {
        content: 'Hello world!\nNew line',
      },
    ],
  },
  {
    type: 'paragraph',
    data: [
      {
        content: 'Hello',
      },
      {
        style: ['bold'],
        content: 'BOLD',
      },
      {
        style: ['italic'],
        content: 'italic world!',
      },
    ],
  },
  {
    type: 'paragraph',
    align: 'center',
    data: [
      {
        content: 'Hello center',
      },
      {
        style: ['bold', 'underline'],
        content: 'bold and underline world!',
      },
    ],
  },
  {
    type: 'image',
    data: [
      {
        alt: 'episode-1',
        src: 'https://image.com/episode-1.jpg',
      },
    ],
  },
];

const getStyleTag = (type: StyleType) => {
  if (type === 'bold') {
    return 'strong';
  }
  if (type === 'italic') {
    return 'em';
  }
  if (type === 'underline') {
    return 'u';
  }
  return '';
};

const setContentData = (element: HTMLParagraphElement, data: EditorContentData) => {
  if (data.style) {
    const styleTags = data.style.map(style => document.createElement(getStyleTag(style)));
    styleTags.forEach((styleTag, i) => {
      if (i === 0) {
        // eslint-disable-next-line no-param-reassign
        styleTag.innerText = data.content;
      } else {
        styleTag.appendChild(styleTags[i - 1]);
      }
    });
    return element.appendChild(styleTags.slice(-1)[0]);
  }
  // eslint-disable-next-line no-param-reassign
  element.innerText = data.content;
  return element;
};

const setImageData = (element: HTMLParagraphElement, data: EditorImageData) => {
  const img = document.createElement('img');

  img.setAttribute('src', data.src);
  img.setAttribute('alt', data.alt);
  return element.appendChild(img);
};

export const convertToHTML = (root: HTMLDivElement, editorData: EditorElementData[]) => {
  const base = document.createElement('div');
  editorData.forEach(({ type, data }) => {
    const tagElement = document.createElement('p');
    data.forEach(item => {
      if (type === 'paragraph') {
        setContentData(tagElement as HTMLParagraphElement, item as EditorContentData);
      } else {
        setImageData(tagElement as HTMLImageElement, item as EditorImageData);
      }
    });
    base.appendChild(tagElement);
  });
  // eslint-disable-next-line no-param-reassign
  root.innerHTML = base.innerHTML;

  return root;
};

export const convertToEditorData = (htmlString: string): EditorElementData[] => {
  const arr = htmlString.match(/<p>([^]*?)<\/p>/g);

  if (!arr) {
    return [];
  }

  return arr.reduce<EditorElementData[]>((acc, cur) => {
    const value = cur.replaceAll('<p>', '').replaceAll('</p>', '').replaceAll('<br>', '\n');
    const type = value.includes('<img') ? 'image' : 'paragraph';

    return [
      ...acc,
      {
        type,
        data: [
          {
            content: value,
          },
        ],
      },
    ];
  }, []);
};

export const pasteTextHandler = (clipboardData: DataTransfer) => {
  const paste = clipboardData.getData('text');
  const pTag = document.createElement('p');
  const pastedText = paste.replaceAll('\n', '<br>');
  pTag.innerHTML = pastedText;

  return pTag;
};
