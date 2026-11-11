import { handleDownloadProps } from '@constants/interfaces';
import { ModalContext as modalContext } from '@ui/modalContext/ModalContext';
import { useContext } from 'react';

export default function useHandleDownload() {
  const { onModalContentChange: setModalContent } = useContext(modalContext);

  const handleDownload = ({
    url,
    fileName = 'file',
    method = 'GET',
    headers = {
      'Content-Type': 'application/json',
    },
    errorModalContent,
  }: handleDownloadProps) => {
    void (async () => {
      try {
        const data = await fetch(url, {
          method,
          headers,
        });

        const { base64PDFfile } = (await data.json()) || {};

        if (!base64PDFfile) {
          return setModalContent(errorModalContent);
        }

        const el = document.createElement('a');
        el.href = `data:application/pdf;base64,${base64PDFfile}`;
        el.download = `${fileName}.pdf`;
        el.click();
      } catch (err) {
        if (err) {
          setModalContent(errorModalContent);
        }
      }
    })();
  };

  return { handleDownload };
}
