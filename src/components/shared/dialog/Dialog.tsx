'use client';

import { useContext } from 'react';
import { ModalContext as modalContext } from '@components/shared/ModalContext';
import styles from './Dialog.module.css';

export const DIALOG_TEST_ID = 'dialog-test-id';

export default function Dialog() {
  const { modalRef, modalContent } = useContext(modalContext);

  if (!modalContent) {
    return null;
  }

  return (
    <dialog
      data-open={!!modalContent}
      data-testid={DIALOG_TEST_ID}
      ref={modalRef}
      className={styles.dialog}
    >
      <div className={styles.content}>
        {modalContent}
      </div>
    </dialog>
  );
}
