import { InputComponentProps } from '@constants/interfaces';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useState } from 'react';
import styles from './InputComponent.module.css';

export default function InputComponent({
  component: Component = 'input',
  type = 'text',
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
          {/* Required (the form checks it itself, see ContactForm's noValidate). An address is an
           * identifier, not prose: no autocorrect, capitals or spellcheck */}
          <Component
            {...(Component === 'input' && { type })}
            {...(type === 'email' && { autoCorrect: 'off', autoCapitalize: 'none', spellCheck: false })}
            onChange={handleChange}
            value={value}
            maxLength={maxLength}
            required
            aria-invalid={isError}
            aria-describedby={isError ? `${errorId} ${counterId}` : counterId}
            id={id}
            name={id}
            className={styles.field}
            {...rest}
          />
          {/* Named by its <label>; the error and the characters left describe it. The error is shown
           * in text, not only by the field's color (WCAG 1.4.1, 3.3.1). It isn't a live region: after a
           * failed send, the focus moves to the first field with an error, which reads it out (see
           * ContactForm) */}
          <div className={styles.meta}>
            <p id={errorId} className={styles.error}>
              {isError ? errorText : ''}
            </p>
            <p className={styles.counter}>
              <span aria-hidden>{remaining}</span>
              <span id={counterId} className="sr-only">
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
