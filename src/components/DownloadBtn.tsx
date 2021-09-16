import React from 'react';

interface DownloadBtnProps {
  value: any;
  fileName: string;
}

export const getJSONStringify = (obj: any) => JSON.stringify(obj, null, 2);

export const DownloadBtn = ({ value, fileName }: DownloadBtnProps) => (
  <div>
    <a
      type="button"
      href={`data:text/json;charset=utf-8,${encodeURIComponent(getJSONStringify(value))}`}
      download={fileName}
    >
      Download
    </a>
  </div>
);
