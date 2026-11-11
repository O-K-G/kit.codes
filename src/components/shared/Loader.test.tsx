import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader, { LOADER_TEST_ID } from '@components/shared/Loader';
import styles from '@components/shared/Loader.module.css';

describe('Loader Component - start', () => {
  beforeAll(() => {
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      writable: true,
    });
  });

  it('should initially show the loader', () => {
    act(() => {
      window.dispatchEvent(new Event('load'));
    });
    render(<Loader />);
    const loader = screen.getByTestId(LOADER_TEST_ID);
    expect(loader).toBeInTheDocument();
    expect(loader.parentElement).toHaveClass(styles.loader);
    expect(loader.parentElement).toHaveAttribute('data-open', 'true');
  });
});

describe('Loader Component - end', () => {
  beforeAll(() => {
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true,
    });
  });

  it('should hide the loader after the load event', async () => {
    act(() => {
      window.dispatchEvent(new Event('load'));
    });
    render(<Loader />);
    const loader = screen.getByTestId(LOADER_TEST_ID);

    expect(loader.parentElement).toHaveClass(styles.loader);
    expect(loader.parentElement).toHaveAttribute('data-open', 'false');
  });

  it('should remove the loader from the DOM after the transition ends', async () => {
    act(() => {
      window.dispatchEvent(new Event('load'));
    });
    render(<Loader />);
    const loader = screen.getByTestId(LOADER_TEST_ID);
    fireEvent.transitionEnd(loader.parentElement as HTMLDivElement);
    expect(loader).not.toBeInTheDocument();
  });
});
