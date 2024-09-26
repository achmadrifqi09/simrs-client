import {RefinementCtx, z} from "zod"
import {Gender, PatientType} from "@/enums/common";

const oldPatientSchema = z.object({
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

const newPatientSchema = z.object({
    name: z.string()
        .min(4, {message: "Nama minimal 4 karakter"}),
    phone_number: z.string()
        .min(8, {message: "Nomor HP minimal 8 digit"})
        .max(13, {message: "Nomor HP maksimal 13 digit"}),
    gender: z.nativeEnum(Gender, {message: "Jenis kelamin harus laki-laki/perempuan"}),
    day_of_birth: z.string()
        .min(1, {message: "Tanggal minimal 1 digit"})
        .max(2, {message: "Tanggal maximal 2 digit"}),
    month_and_year: z.string(),
}).superRefine((data, ctx: RefinementCtx) => {
    const phoneNumberRegex = /^(?:\+62|0)[2-9]\d{7,10}$/
    const nameRegex = /^(?!.*(.)\1{3,})(?!.*[.-]{2,})[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s'.-]{1,49}$/

    if(!phoneNumberRegex.test(data.phone_number)) {
        ctx.addIssue({
            path: ['phone_number'],
            message: "Nomor telepon tidak valid",
            code: z.ZodIssueCode.custom
        })
    }

    if(!nameRegex.test(data.name)) {
        ctx.addIssue({
            path: ['name'],
            message: "Nama tidak valid",
            code: z.ZodIssueCode.custom
        })
    }
})


export {oldPatientSchema, newPatientSchema}