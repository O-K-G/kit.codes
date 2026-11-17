import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader, { LOADER_TEST_ID } from '@ui/loader/Loader';
import {
  LOADER_CRITICAL_IMAGE_ATTRIBUTE,
  LOADER_DEFERRED_IMAGE_ATTRIBUTE,
} from '@constants/loader';
import styles from '@ui/loader/Loader.module.css';

/** jsdom has no HTMLImageElement.decode: mock it with a promise the test resolves. */
function mockImageDecode() {
  let resolveDecode: () => void = () => undefined;
  const decode = jest.fn(
    () => new Promise<void>((resolve) => (resolveDecode = resolve))
  );
  Object.defineProperty(HTMLImageElement.prototype, 'decode', {
    value: decode,
    configurable: true,
  });

  return { decode, resolveDecode: () => resolveDecode() };
}

function renderWithCriticalImage() {
  return render(
    <>
      <img alt='' {...{ [LOADER_CRITICAL_IMAGE_ATTRIBUTE]: true }} />
      <Loader />
    </>
  );
}

afterEach(() => {
  delete (HTMLImageElement.prototype as Partial<HTMLImageElement>).decode;
});

describe('Loader Component', () => {
  it('shows the loader until the critical images are decoded', async () => {
    const { decode, resolveDecode } = mockImageDecode();
    renderWithCriticalImage();
    const loader = screen.getByTestId(LOADER_TEST_ID);

    expect(loader.parentElement).toHaveClass(styles.loader);
    expect(loader.parentElement).toHaveAttribute('data-open', 'true');
    await waitFor(() => expect(decode).toHaveBeenCalledTimes(1));
    expect(loader.parentElement).toHaveAttribute('data-open', 'true');

    resolveDecode();

    await waitFor(() =>
      expect(loader.parentElement).toHaveAttribute('data-open', 'false')
    );
  });

  it('hides the loader even if a critical image fails to load', async () => {
    Object.defineProperty(HTMLImageElement.prototype, 'decode', {
      value: () => Promise.reject(new Error('EncodingError')),
      configurable: true,
    });
    renderWithCriticalImage();
    const loader = screen.getByTestId(LOADER_TEST_ID);

    await waitFor(() =>
      expect(loader.parentElement).toHaveAttribute('data-open', 'false')
    );
  });

  it('starts fetching the deferred (lazy) images only once the critical ones are ready', async () => {
    const { resolveDecode } = mockImageDecode();
    render(
      <>
        <img alt='' {...{ [LOADER_CRITICAL_IMAGE_ATTRIBUTE]: true }} />
        <img
          alt=''
          data-testid='deferred'
          loading='lazy'
          {...{ [LOADER_DEFERRED_IMAGE_ATTRIBUTE]: true }}
        />
        <Loader />
      </>
    );
    const deferred = screen.getByTestId('deferred');

    await waitFor(() => Promise.resolve());
    expect(deferred).toHaveAttribute('loading', 'lazy');

    resolveDecode();

    await waitFor(() => expect(deferred).toHaveAttribute('loading', 'eager'));
  });

  it('stays open while `open` is set', async () => {
    render(<Loader open />);
    const loader = screen.getByTestId(LOADER_TEST_ID);

    await waitFor(() => Promise.resolve());
    expect(loader.parentElement).toHaveAttribute('data-open', 'true');
  });

  it('removes the loader from the DOM after the fade-out transition ends', async () => {
    render(<Loader />);
    const loader = screen.getByTestId(LOADER_TEST_ID);

    await waitFor(() =>
      expect(loader.parentElement).toHaveAttribute('data-open', 'false')
    );
    fireEvent.transitionEnd(loader.parentElement as HTMLDivElement);
    expect(loader).not.toBeInTheDocument();
  });
});
