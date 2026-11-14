'use client';

import { useContext } from 'react';
import { ModalContext as modalContext } from '@ui/modalContext/ModalContext';
import { DIALOG_TITLE_ID } from '@ui/dialog/DialogTitle';
import styles from './Dialog.module.css';

export const DIALOG_TEST_ID = 'dialog-test-id';

export default function Dialog() {
  const { modalRef, modalContent } = useContext(modalContext);

  if (!modalContent) {
    return null;
  }

  return (
    // Named by its content's title (see DialogTitle). Opened with showModal(), so the browser makes
    // it modal: focus moves in and stays in, Escape closes it, and focus returns to the opener.
    <dialog
      data-testid={DIALOG_TEST_ID}
      aria-labelledby={DIALOG_TITLE_ID}
      ref={modalRef}
      className={styles.dialog}
    >
      <div>
        {modalContent}
      </div>
    </dialog>
  );
}
