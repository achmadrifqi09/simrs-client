import {z} from 'zod';
import {employeeValidation} from "@/validation-schema/employee";

type EmployeeForm = z.infer<typeof employeeValidation>

export type {
    EmployeeForm
}
