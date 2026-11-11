import React, { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dialog, { DIALOG_TEST_ID } from '@ui/dialog/Dialog';
import { ModalContext } from '@ui/modalContext/ModalContext';

const MODAL_CONTENT = 'Mock Modal Content';
const ROLE = 'dialog';

const mockContextValue = {
  onModalContentChange: jest.fn(),
  onCloseModal: jest.fn(),
  modalRef: { current: null },
  modalContent: <div>{MODAL_CONTENT}</div>,
};

function renderWithContext(component: ReactNode) {
  return render(
    <ModalContext.Provider value={mockContextValue}>
      {component}
    </ModalContext.Provider>
  );
}

describe('Dialog Component', () => {
  it('renders <Modal /> content when a content is provided', () => {
    renderWithContext(<Dialog />);

    const modal = screen.getByTestId(DIALOG_TEST_ID);
    expect(modal).toBeInTheDocument();
    expect(screen.getByText(MODAL_CONTENT)).toBeInTheDocument();
  });

  it('does not render if modalContent is null', () => {
    const mockContextValueWithNullContent = {
      ...mockContextValue,
      modalContent: null,
    };

    render(
      <ModalContext.Provider value={mockContextValueWithNullContent}>
        <Dialog />
      </ModalContext.Provider>
    );

    expect(screen.queryByRole(ROLE)).not.toBeInTheDocument();
  });
});
