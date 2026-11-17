import { z } from 'zod';
import { FormDataSchema, FormErrorNames, FormValidationProps } from '@constants/interfaces';

/** Validates the contact form's fields; `invalidFields` lists the ones that aren't valid */
export default function formValidation(fields: Partial<FormValidationProps>) {
  const { success, error } = FormDataSchema.safeParse(fields);
  const invalidFields = error
    ? (Object.keys(z.flattenError(error).fieldErrors) as FormErrorNames)
    : [];

  return { isValidated: success, invalidFields };
}
