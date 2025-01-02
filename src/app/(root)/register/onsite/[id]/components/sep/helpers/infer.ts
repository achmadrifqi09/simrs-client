import { z } from 'zod';
import { SEPValidationSchema } from '@/validation-schema/sep';

type FormSEP = z.infer<typeof SEPValidationSchema>;

export type { FormSEP };
