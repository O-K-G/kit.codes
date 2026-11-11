import { FormValidationProps } from '@constants/interfaces';
import { FormDataSchema } from '@constants/interfaces';

export default function formValidation({
  email,
  subject,
  content,
}: FormValidationProps) {
  const { success, error } = FormDataSchema.safeParse({
    email,
    subject,
    content,
  });

  return { isValidated: success, error: error?.flatten().fieldErrors };
}
