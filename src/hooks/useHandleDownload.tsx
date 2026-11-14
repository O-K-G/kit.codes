import { useState } from 'react';
import { handleDownloadProps } from '@constants/interfaces';

/** Downloads a PDF served as base64; `hasError` is set when it fails, for the caller to report it. */
export default function useHandleDownload() {
  const [hasError, setHasError] = useState(false);

  const handleDownload = ({
    url,
    fileName = 'file',
    method = 'GET',
    headers = {
      'Content-Type': 'application/json',
    },
  }: handleDownloadProps) => {
    void (async () => {
      try {
        const data = await fetch(url, {
          method,
          headers,
        });

        const { base64PDFfile } = (await data.json()) || {};

        if (!base64PDFfile) {
          setHasError(true);
          return;
        }

        const el = document.createElement('a');
        el.href = `data:application/pdf;base64,${base64PDFfile}`;
        el.download = `${fileName}.pdf`;
        el.click();
      } catch {
        setHasError(true);
      }
    })();
  };

  return { handleDownload, hasError, clearError: () => setHasError(false) };
}
