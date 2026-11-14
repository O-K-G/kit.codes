import { handleA11y1000FirstNumbers } from '@utils/handleA11y1000FirstNumbers';
import { InputComponentProps } from '@constants/interfaces';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import DOMPurify from "isomorphic-dompurify";
import styles from './InputComponent.module.css';

export default function InputComponent({
  component: Component = 'input',
  id,
  maxLength,
  onChange,
  isError,
  bottomSlot,
  isReset,
  label,
  ...rest
}: InputComponentProps) {
  const [value, setValue] = useState('');
  const t = useTranslations('inputComponentText');

  useEffect(() => {
    if (isReset) {
      setValue('');
    }
  }, [isReset]);

  const ariaLabelErrorValueById = {
    email: t('emailAriaLabelError'),
    subject: t('subjectAriaLabelError'),
    content: t('contentAriaLabelError'),
  };

  const remaining = maxLength - value.length;
  const counterText = `${handleA11y1000FirstNumbers(remaining)} ${t(
    remaining !== 1 ? 'charactersAriaLabelError' : 'characterAriaLabelError'
  )} ${t('remain')}`;
  const errorText = `${t('error')} - ${
    ariaLabelErrorValueById[id as keyof typeof ariaLabelErrorValueById]
  }`;
  const errorId = `${id}-error`;
  const counterId = `${id}-counter`;

  return (
    <div className={styles.container}>
      <div className={styles.labelWrapper}>
        <label
          htmlFor={id}
        >
          {label}:
        </label>
      </div>
      <div className={styles.fieldColumn}>
        <div className={styles.fieldWrapper}>
          <Component
            type="text"
            {...rest}
            onChange={({ target: { value } }) => {
              setValue(DOMPurify.sanitize(value));
              onChange?.();
            }}
            value={value}
            maxLength={maxLength}
            aria-invalid={isError}
            aria-required
            aria-describedby={isError ? `${errorId} ${counterId}` : counterId}
            id={id}
            name={id}
            className={styles.field}
          />
          {/* Named by its <label>; the error and the characters left describe it. The error is shown
           * in text, not only by the field's color (WCAG 1.4.1, 3.3.1), and announced when it appears */}
          <div className={styles.meta}>
            <p id={errorId} aria-live="assertive" className={styles.error}>
              {isError ? errorText : ''}
            </p>
            <p className={styles.counter}>
              <span aria-hidden>{remaining}</span>
              <span id={counterId} className={styles.srOnly}>
                {counterText}
              </span>
            </p>
          </div>
        </div>
        {bottomSlot}
      </div>
    </div>
  );
}
