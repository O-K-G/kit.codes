import styles from "./dialog.module.css";
import {
  ReactNode,
  TransitionEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type DialogProps = {
  "aria-label": string;
  children: ReactNode;
  open: boolean;
};

export default function Dialog({
  "aria-label": ariaLabel,
  children,
  open,
  ...rest
}: DialogProps) {
  const [shouldRender, setShouldRender] = useState(open);
  const [prevOpen, setPrevOpen] = useState(open);
  const backdropRef = useRef<HTMLDivElement>(null);

  if (open !== prevOpen) {
    setPrevOpen(open);

    if (open) {
      setShouldRender(true);
    }
  }

  useLayoutEffect(() => {
    if (open) {
      return;
    }

    const activeElement = document.activeElement as HTMLElement | null;
    if (activeElement && backdropRef.current?.contains(activeElement)) {
      activeElement.blur();
    }
  }, [open]);

  const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) {
      return;
    }

    if (!open) {
      setShouldRender(false);
    }
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      ref={backdropRef}
      data-open={open}
      aria-hidden={!open}
      className={styles.backdrop}
      onTransitionEnd={handleTransitionEnd}
    >
      <div role="dialog" aria-label={ariaLabel} aria-modal={open} {...rest}>
        {children}
      </div>
    </div>
  );
}
