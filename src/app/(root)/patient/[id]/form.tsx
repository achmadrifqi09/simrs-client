import {z} from 'zod';
import {patientValidation} from "@/validation-schema/patient";

type PatientForm = z.infer<typeof patientValidation>

export type {
    PatientForm
}
