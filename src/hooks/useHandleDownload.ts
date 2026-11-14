import { useState } from 'react';
import { HandleDownloadProps } from '@constants/interfaces';

/** Downloads a PDF served as base64; `hasError` is set when it fails, for the caller to report it. */
export default function useHandleDownload() {
  const [hasError, setHasError] = useState(false);

  const handleDownload = ({ url, fileName = 'file' }: HandleDownloadProps) => {
    void (async () => {
      try {
        const response = await fetch(url);
        const { base64PDFfile } = (await response.json()) || {};

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
