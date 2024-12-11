import {z} from 'zod';
import {employeeValidationSchema} from "@/validation-schema/employee";

type EmployeeForm = z.infer<typeof employeeValidationSchema>

export type {
    EmployeeForm
}
