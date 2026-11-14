import {
  Dispatch,
  MouseEvent,
  ReactNode,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react';

export default function useHandleModal({
  modalRef,
  modalContent,
  onModalChange: setModalContent,
}: {
  modalRef: RefObject<null>;
  modalContent: ReactNode;
  onModalChange: Dispatch<SetStateAction<ReactNode>>;
}) {
  const handleCloseModal = useCallback(
    (e: Event | MouseEvent<HTMLElement>, val?: 'close') => {
      const modalEl = modalRef.current as unknown as HTMLDialogElement;
      const { open } = modalEl;
      const { tagName } = (e.target as unknown as { tagName: string }) || {};

      if (tagName?.toLocaleLowerCase() === 'dialog' || val === 'close') {
        if (modalContent) {
          modalEl.removeEventListener('click', handleCloseModal);

          if (open) {
            modalEl.close();
          }
          setModalContent(null);
        }
      }
    },
    [modalContent, modalRef, setModalContent]
  );

  useEffect(() => {
    const modalEl = modalRef.current as unknown as HTMLDialogElement;
    const { open } = modalEl || {};

    /** Closed by the browser too (Escape): clears the content, so the dialog's state follows */
    const handleClose = () => setModalContent(null);

    if (modalContent && !open) {
      modalEl?.showModal();
      modalEl?.addEventListener('click', handleCloseModal);
    }

    modalEl?.addEventListener('close', handleClose);

    return () => {
      modalEl?.removeEventListener('click', handleCloseModal);
      modalEl?.removeEventListener('close', handleClose);
    };
  }, [handleCloseModal, modalContent, modalRef, setModalContent]);

  return { handleCloseModal };
}
