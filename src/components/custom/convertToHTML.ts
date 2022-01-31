import { ContentAnnotationType, EditorContentData, EditorElement, EditorImageData } from './type';

const getAnnotationTag = (type: ContentAnnotationType) => {
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

const setContentHTML = (element: HTMLParagraphElement, data: EditorContentData) => {
  if (data.annotations) {
    const styleTags = Object.keys(data.annotations).map(annotation =>
      document.createElement(getAnnotationTag(annotation as ContentAnnotationType)),
    );
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

const setImageHTML = (element: HTMLParagraphElement, data: EditorImageData) => {
  const img = document.createElement('img');

  img.setAttribute('src', data.src);
  img.setAttribute('alt', data.alt);
  return element.appendChild(img);
};

export const convertEditorDataToHTML = (root: HTMLDivElement, editorData: EditorElement[]) => {
  const base = document.createElement('div');
  editorData.forEach(({ type, data }) => {
    const tagElement = document.createElement('p');
    data.forEach(item => {
      if (type === 'paragraph') {
        setContentHTML(tagElement as HTMLParagraphElement, item as EditorContentData);
      } else {
        setImageHTML(tagElement as HTMLImageElement, item as EditorImageData);
      }
    });
    base.appendChild(tagElement);
  });
  // eslint-disable-next-line no-param-reassign
  root.innerHTML = base.innerHTML;

  return root;
};
