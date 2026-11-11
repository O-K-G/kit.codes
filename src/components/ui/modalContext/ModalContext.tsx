'use client';

import { ReactNode, createContext, useState, useRef, MouseEvent } from 'react';
import useHandleModal from '@hooks/useHandleModal';
import {
  ModalContextProps,
  ModalContextComponentProps,
} from '@constants/interfaces';

export const ModalContext = createContext({
  onModalContentChange: () => null,
  modalRef: { current: null },
  modalContent: null,
  onCloseModal: () => null,
} as ModalContextProps);

export default function ModalContextComponent({
  children,
}: ModalContextComponentProps) {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const modalRef = useRef(null);

  const { handleCloseModal } = useHandleModal({
    modalRef,
    modalContent,
    onModalChange: setModalContent,
  });

  const ModalContextData = {
    onModalContentChange: setModalContent,
    onCloseModal: (e: Event | MouseEvent<HTMLElement>) =>
      handleCloseModal(e, 'close'),
    modalRef,
    modalContent,
  };

  return (
    <ModalContext.Provider value={ModalContextData}>
      {children}
    </ModalContext.Provider>
  );
}
