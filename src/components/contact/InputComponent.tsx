import { InputComponentProps } from '@constants/interfaces';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useState } from 'react';
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
  const [wasReset, setWasReset] = useState(isReset);
  const t = useTranslations('inputComponentText');

  // Clears the text when `isReset` turns on (the message was sent). Done while rendering, as React
  // recommends for state that follows a prop, rather than in an effect, which would render twice.
  if (isReset !== wasReset) {
    setWasReset(isReset);
    if (isReset) {
      setValue('');
    }
  }

  const ariaLabelErrorValueById = {
    email: t('emailAriaLabelError'),
    subject: t('subjectAriaLabelError'),
    content: t('contentAriaLabelError'),
  };

  const remaining = maxLength - value.length;
  const counterText = `${remaining} ${t(
    remaining !== 1 ? 'charactersAriaLabelError' : 'characterAriaLabelError'
  )} ${t('remain')}`;
  const errorText = `${t('error')} - ${
    ariaLabelErrorValueById[id as keyof typeof ariaLabelErrorValueById]
  }`;
  const errorId = `${id}-error`;
  const counterId = `${id}-counter`;

  /** Keeps the text, and tells the form the field changed. (It's plain text: React escapes it
   * wherever it's shown, the email included, so it isn't sanitized here.) */
  const handleChange = ({
    target: { value: newValue },
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(newValue);
    onChange?.();
  };

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
            onChange={handleChange}
            value={value}
            maxLength={maxLength}
            aria-invalid={isError}
            aria-required
            aria-describedby={isError ? `${errorId} ${counterId}` : counterId}
            id={id}
            name={id}
            className={styles.field}
            {...rest}
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
