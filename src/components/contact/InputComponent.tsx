import { handleA11y1000FirstNumbers } from '@utils/handleA11y1000FirstNumbers';
import { InputComponentProps } from '@constants/interfaces';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import DOMPurify from "isomorphic-dompurify";
import styles from './InputComponent.module.css';

export default function InputComponent({
  component: Component = 'input',
  id,
  placeholder,
  minLength,
  maxLength,
  rows,
  onChange,
  isError,
  bottomSlot,
  isReset,
  onClick,
  label,
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

  const ariaLabel = !isError
    ? `${
        !value
          ? handleA11y1000FirstNumbers(maxLength)
          : handleA11y1000FirstNumbers(maxLength - value.length)
      } ${t(
        maxLength - value.length !== 1
          ? 'charactersAriaLabelError'
          : 'characterAriaLabelError'
      )} ${t('remain')}`
    : `${t('error')} - ${
        ariaLabelErrorValueById[id as keyof typeof ariaLabelErrorValueById]
      }`;

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
            onChange={({ target: { value } }) => {
              setValue(DOMPurify.sanitize(value));
              onChange?.();
            }}
            onClick={onClick}
            value={value}
            minLength={minLength}
            maxLength={maxLength}
            aria-label={ariaLabel}
            aria-invalid={isError}
            id={id}
            name={id}
            className={styles.field}
            placeholder={placeholder}
            rows={rows}
          />
          <div aria-live="assertive" className={styles.srOnly}>
            {isError ? ariaLabel : ''}
          </div>
          <div aria-hidden className={styles.counter}>
            {!value ? maxLength : maxLength - value.length}
          </div>
        </div>
        {bottomSlot}
      </div>
    </div>
  );
}
