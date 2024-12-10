import z from 'zod';

const phoneNumberRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
export const registrationValidation = z
    .object({
        cob: z.number().nullish(),
        no_cob: z.string().nullish(),
        nama_wali: z
            .string({ message: 'Nama wali harus di isi' })
            .min(3, { message: 'Nama wali minimal 3 karakter' })
            .max(50, { message: 'Nama wali tidak boleh lebih dari 50 karakter' }),
        telp_wali: z
            .string({ message: 'Nomor hp wali harus diisi' })
            .regex(phoneNumberRegex, 'Nomor hp wali harus berupa nomor telepon yang valid')
            .max(14, { message: 'Nomor hp wlai makasimal 14 digit' }),
        id_hub_wali: z.number({ message: 'Id hubungan wali harus berupa angka' }).nullish(),
        asal_rujukan: z.string().max(100, { message: 'Asal rujukan tidak boleh lebih dari 50 karakter' }).nullish(),
        nama_perujuk: z.string().max(100, { message: 'Nama perujuk tidak boleh lebih dari 50 karakter' }).nullish(),
        jenis_pasien: z.string().nullish(),
        ket_rujukan: z.string().max(100, { message: 'Nama perujuk tidak boleh lebih dari 50 karakter' }).nullish(),
        status_rujukan: z
            .string({ message: 'Status rujukan harus berupa angka' })
            .nullish()
            .refine((value) => Number(value)),
        nomor_rujuk_balik: z
            .string()
            .max(50, {
                message: 'Nomor rujukan balik/kontrol tidak boleh dari 50 karakter',
            })
            .nullish(),
        no_rujukan: z.string().max(50, {
            message: 'Nomor rujukan balik/kontrol tidak boleh dari 50 karakter',
        }),
        tgl_rujukan: z.string({ message: 'Tanggal harus diisi' }),
        tgl_daftar: z.string({ message: 'Tanggal harus diisi' }),
        id_asuransi: z.number({ message: 'Id asuransi harus berupa nomor' }).nullish(),
        nomor_asuransi: z.string().max(50, { message: 'Nomor asuransi tidak boleh dari 50 karakter' }).nullish(),
    })
    .refine(
        (value) => {
            if (!value?.id_asuransi && (!value?.nomor_asuransi || value.nomor_asuransi === ' ')) return true;
            return !!(value?.id_asuransi && value?.nomor_asuransi);
        },
        { message: 'Nomor asuransi harus di isi dan minimal 4 karakter', path: ['nomor_asuransi'] }
    )
    .refine(
        (value) => {
            if (value.id_asuransi === 1 && !value.nomor_rujuk_balik && Number(value.status_rujukan) !== 1) return false;
            return true;
        },
        { message: 'Selain rujukan FKTP No rujuk balik/kontrol harus diisi', path: ['nomor_rujuk_balik'] }
    )
    .refine(
        (value) => {
            if (value.id_asuransi === 1 && (!value.no_rujukan || value.no_rujukan === '')) return false;
            return true;
        },
        { message: 'Pasien BPJS harus menyertakan nomor rujukan', path: ['no_rujukan'] }
    )
    .refine(
        (value) => {
            if ((value.id_asuransi === 1 && !value.tgl_rujukan) || value?.tgl_rujukan === '') return false;
            return true;
        },
        { message: 'Pasien BPJS harus menyertakan tanggal rujukan', path: ['tgl_rujukan'] }
    )
    .refine(
        (val) => {
            const regexFirstYear = /^\d{4}-\d{2}-\d{2}$/;
            const regexLastYear = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
            return regexFirstYear.test(val.tgl_daftar) || regexLastYear.test(val.tgl_daftar);
        },
        {
            message: 'Tanggal daftar tidak valid, format harus dd-mm-yyyy',
            path: ['tgl_daftar'],
        }
    )
    .refine(
        (val) => {
            const regexFirstYear = /^\d{4}-\d{2}-\d{2}$/;
            const regexLastYear = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

            if (val.id_asuransi !== 1) return true;
            return regexFirstYear.test(val.tgl_rujukan) || regexLastYear.test(val.tgl_rujukan);
        },
        {
            message: 'Tanggal rujukan tidak valid, format harus dd-mm-yyyy',
            path: ['tgl_rujukan'],
        }
    );
