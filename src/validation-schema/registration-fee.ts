import z from 'zod'

export const registrationFeeValidation = z.object({
    biaya_daftar: z.string({message: 'Biaya daftar harus diisi'}).refine(
        (value) => {
            return /^[0-9]+$/.test(value);
        },
        {message: 'Biaya pendaftaran harus berupa angka'},
    ),
    diskon_daftar: z
        .string()
        .refine(
            (value) => {
                return value === '' || /^[0-9]+$/.test(value);
            },
            {
                message:
                    'Diskon pendaftaran hanya boleh berisi angka atau dibiarkan kosong.',
            },
        )
        .transform((value) => {
            return value === '' || value === undefined ? '0' : value;
        }),
    biaya_kartu: z
        .string()
        .refine((value) => {
            return value === '' || /^[0-9]+$/.test(value);
        })
        .transform((value) => {
            return value === '' || value === undefined ? '0' : value;
        }),
    diskon_kartu: z
        .string()
        .refine(
            (value) => {
                return value === '' || /^[0-9]+$/.test(value);
            },
            {
                message: 'Diskon kartu hanya boleh berisi angka atau dibiarkan kosong.',
            },
        )
        .transform((value) => {
            return value === '' || value === undefined ? '0' : value;
        }),
    biaya_dokter: z.string({message: 'Biaya dokter harus diisi'}).refine(
        (value) => {
            return /^[0-9]+$/.test(value);
        },
        {message: 'Biaya dokter harus berupa angka'},
    ),
    diskon_dokter: z
        .string()
        .refine(
            (value) => {
                return value === '' || /^[0-9]+$/.test(value);
            },
            {
                message:
                    'Diskon dokter hanya boleh berisi angka atau dibiarkan kosong.',
            },
        )
        .transform((value) => {
            return value === '' || value === undefined ? '0' : value;
        }),
})