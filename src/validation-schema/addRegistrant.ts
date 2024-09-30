import {RefinementCtx, z} from "zod"
import {PatientType} from "@/enums/common";

const addRegistrantSchema = z.object({
    patient_type: z.nativeEnum(PatientType, {message: "Jenis pasien harus BPJS / Umum"}),
    identifier_number: z.string()
        .min(7, {message: "Nomor minimal 7 karakter"})
        .max(16, {message: "Nomor maximal 16 karakter"})
}).superRefine((data, ctx) => {
    const identifierNumberLength = data.identifier_number.length;
    const allowedLength = [7, 13, 16]

    if (data.patient_type === PatientType.BPJS &&
        !allowedLength.includes(identifierNumberLength)) {
        ctx.addIssue({
            path: ['identifier_number'],
            message: "Nomor harus 7 digit untuk nomor RM, 13 digit untuk nomor BPJS dan 16 digit untuk NIK",
            code: z.ZodIssueCode.custom
        })
    }

    if (data.patient_type === PatientType.GENERAL &&
        !allowedLength.includes(identifierNumberLength)) {
        ctx.addIssue({
            path: ['identifier_number'],
            message: "Nomor harus 7 digit untuk nomor RM dan 16 digit untuk NIK",
            code: z.ZodIssueCode.custom
        })
    }
})

export {addRegistrantSchema}