import {z} from 'zod';
import {zfd} from "zod-form-data";

const ifStringOrNumber = z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') return Number(val);
    return val;
});

const dateValidation = z
    .string()
    .refine(
        (val) => /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/.test(val),
        {
            message: 'Tanggal tidak valid, format harus dd-mm-yyyy',
        }
    );

const employeeValidation = z.object({
    nip_pegawai: z
        .string({message: 'NIP Pegawai harus diisi'})
        .min(18, {message: 'Minimal 18 karakter'})
        .max(18, {message: 'Maksimal 18 karakter'})
        .regex(/^\d+$/, {message: 'Hanya angka yang diperbolehkan'}),
    foto: zfd
        .file()
        .refine((file) => file.size < 5000000, {
            message: "File can't be bigger than 5MB.",
        })
        .refine(
            (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
            {
                message: "File format must be either jpg, jpeg lub png.",
            }
        ),
    ktp: zfd
        .file()
        .refine((file) => file.size < 5000000, {
            message: "File can't be bigger than 5MB.",
        })
        .refine(
            (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
            {
                message: "File format must be either jpg, jpeg lub png.",
            }
        ),
    npwp: zfd
        .file()
        .refine((file) => file.size < 5000000, {
            message: "File can't be bigger than 5MB.",
        })
        .refine(
            (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
            {
                message: "File format must be either jpg, jpeg lub png.",
            }
        ),
    ktam: zfd
        .file()
        .refine((file) => file.size < 5000000, {
            message: "File can't be bigger than 5MB.",
        })
        .refine(
            (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
            {
                message: "File format must be either jpg, jpeg lub png.",
            }
        ),
    kk: zfd
        .file()
        .refine((file) => file.size < 5000000, {
            message: "File can't be bigger than 5MB.",
        })
        .refine(
            (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
            {
                message: "File format must be either jpg, jpeg lub png.",
            }
        ),
    nip_pns: z.string().min(18).max(18).regex(/^\d+$/).optional().nullable(),
    gelar_depan: z.string().max(10).optional().nullable(),
    gelar_belakang: z.string().max(15).optional().nullable(),
    nama_pegawai: z
        .string({message: 'Nama pegawai harus diisi'})
        .min(3)
        .max(100)
        .regex(/^[a-zA-Z\s]+$/, {message: 'Hanya huruf dan spasi diperbolehkan'}),

    id_ms_negara_asal: ifStringOrNumber.optional().nullable(),
    id_ms_provinsi_asal: z.string().regex(/^\d+$/).optional().nullable(),
    id_ms_kota_asal: z.string().regex(/^\d+$/).optional().nullable(),
    id_ms_kecamatan_asal: z.string().regex(/^\d+$/).optional().nullable(),
    id_ms_desa_asal: z.string().regex(/^\d+$/).optional().nullable(),
    alamat_asal: z.string().min(5).optional().nullable(),
    kode_pos_asal: z.string().regex(/^\d+$/).optional().nullable(),
    rt_asal: z.string().max(3).regex(/^\d+$/).optional().nullable(),
    rw_asal: z.string().max(3).regex(/^\d+$/).optional().nullable(),
    id_ms_negara_tinggal: ifStringOrNumber,
    id_ms_provinsi_tinggal: z.string().regex(/^\d+$/),
    id_ms_kota_tinggal: z.string().regex(/^\d+$/),
    id_ms_kecamatan_tinggal: z.string().regex(/^\d+$/),
    id_ms_desa_tinggal: z.string().regex(/^\d+$/),
    alamat_tinggal: z.string().min(5),
    kode_pos_tinggal: z.string().regex(/^\d+$/),
    rt_tinggal: z.string().max(3).regex(/^\d+$/),
    rw_tinggal: z.string().max(3).regex(/^\d+$/),
    tempat_lahir: z.string().min(1),
    tgl_lahir: dateValidation,
    id_jenis_kelamin: ifStringOrNumber.refine((val) => [1, 2].includes(val), {
        message: 'Hanya 1 (laki-laki) atau 2 (perempuan)',
    }),
    id_ms_golongan_darah: ifStringOrNumber,
    id_ms_status_kawin: ifStringOrNumber,
    id_ms_agama: ifStringOrNumber,
    id_ms_pendidikan: ifStringOrNumber.optional(),
    id_ms_jenis_pegawai: ifStringOrNumber.optional(),
    id_ms_status_pegawai: ifStringOrNumber.optional(),
    id_ms_spesialis: ifStringOrNumber.optional(),
    id_unit_induk: ifStringOrNumber.optional(),
    id_pangkat: ifStringOrNumber.optional(),
    id_jabatan: ifStringOrNumber.optional(),
    id_unit_jabatan: ifStringOrNumber.optional(),
    id_gaji: ifStringOrNumber.optional(),
    hp: z
        .string({message: 'Nomor HP harus diisi'})
        .regex(/^\d+$/, {message: 'Hanya angka diperbolehkan'}),
    email: z.string().email(),
    no_npwp: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$/).optional().nullable(),
    no_ktp: z.string().regex(/^\d{16}$/).min(16).max(16),
    no_ktam: z.string().regex(/^[a-zA-Z0-9]+$/).optional().nullable(),
    kode_arsip: z.string().max(10).optional().nullable(),
    id_finger: z.string().max(10).optional().nullable(),
    tgl_masuk: dateValidation.optional().nullable(),
    tgl_keluar: dateValidation.optional().nullable(),
    status_aktif: ifStringOrNumber.refine((val) => [0, 1].includes(val)),
    status_pns: ifStringOrNumber.refine((val) => [0, 1].includes(val)),
    id_pelamar: ifStringOrNumber.optional().nullable(),
});

export {employeeValidation};
