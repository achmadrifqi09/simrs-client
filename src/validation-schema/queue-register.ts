import {RefinementCtx, z} from "zod"
import {Gender} from "@/enums/common";

const rePrintValidation = z.object({
    identifier_type: z.string()
        .min(1, {message: 'Jenis nomor harus diisi'}),
    identifier_code: z.string()
        .min(7, {message: 'Nomor minimal 7 karakter'})
        .max(18, {message: 'Nomor minimal18 karakter'}),
})

const nameValidation = z
    .string()
    .min(3, {message: 'Nama minimal 3 karakter'}).refine((val) => {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(val)) {
            return false;
        }

        const words = val.trim().split(/\s+/);
        if (words.length === 1 && words[0].length < 2) {
            return false;
        }

        for (const word of words) {
            if (word.length < 2) {
                return false;
            }
        }

        const repeatingCharRegex = /(.)\1{2,}/;
        if (repeatingCharRegex.test(val)) {
            return false;
        }

        const suspiciousPatternRegex = /(.)\1{3,}/;
        return !suspiciousPatternRegex.test(val);
    }, {
        message: "Nama tidak valid, harus terdiri dari minimal 3 karakter, tanpa karakter berulang atau pola mencurigakan.",
    });

const dateValidation = z
    .string()
    .refine((val) => {
        const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        return regex.test(val);
    }, {
        message: 'Tanggal tidak valid, mohon masukkan tanggal',
    });

const patientValidationSchema = z.object({
    nama_pasien: nameValidation,
    no_hp: z.string().refine((phoneNumber) => {
        const cleanedVal = phoneNumber.replace(/[^0-9+]/g, '');
        const phoneNumberRegex = /^(?:\+62|62|0)8\d{8,11}$/;
        return phoneNumberRegex.test(cleanedVal);
    }, {
        message: "Nomor HP tidak valid, harus dimulai dengan +62, 62, atau 08 dan diikuti dengan 10 hingga 12 digit angka.",
    }),
    tgl_lahir: dateValidation,
});


const oldPatientValidationSchema = z.object({
    patient_type: z.number(),
    identifier_number: z.string()
        .min(7, {message: "Nomor minimal 7 karakter"})
        .max(16, {message: "Nomor maximal 16 karakter"})
}).superRefine((data, ctx) => {
    const identifierNumberLength = data.identifier_number.length;
    const allowedLength = [7, 13, 16]

    if (Number(data.patient_type) === 2 &&
        !allowedLength.includes(identifierNumberLength)) {
        ctx.addIssue({
            path: ['identifier_number'],
            message: "Nomor harus 7 digit untuk nomor RM, 13 digit untuk nomor BPJS dan 16 digit untuk NIK",
            code: z.ZodIssueCode.custom
        })
    }

    if (Number(data.patient_type) === 4 &&
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

    if (!phoneNumberRegex.test(data.phone_number)) {
        ctx.addIssue({
            path: ['phone_number'],
            message: "Nomor telepon tidak valid",
            code: z.ZodIssueCode.custom
        })
    }

    if (!nameRegex.test(data.name)) {
        ctx.addIssue({
            path: ['name'],
            message: "Nama tidak valid",
            code: z.ZodIssueCode.custom
        })
    }
})


export {oldPatientValidationSchema, newPatientSchema, patientValidationSchema, rePrintValidation}