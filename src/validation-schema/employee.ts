import {z} from 'zod';

const employeeValidationSchema = z.object({
    nip_pegawai: z
        .string({message: 'Format NIP Pegawai tidak valid, harus diisi.'})
        .regex(/^(?:\d{4}\.\d{8}\.\d{2}\.\d{4}|\d{4}\.\d{2}\.\d{5})$/, {
            message:
                'Format NIP Pegawai tidak valid, harus mengikuti format yyyy.ddmmyyyy.xx.xxxx atau yyyy.mm.00000',
        }),
    nip_pns: z.string().nullish(),
    gelar_depan: z.string(),
    gelar_belakang: z.string(),
    nama_pegawai: z.string({message: 'Nama Pegawai Harus diisi'}),
    id_ms_negara_tinggal: z.number(),
    id_ms_provinsi_tinggal: z.string(),
    id_ms_kota_tinggal: z.string(),
    id_ms_kecamatan_tinggal: z.string(),
    id_ms_desa_tinggal: z.string(),
    alamat_tinggal: z.string({message: 'Alamat Tinggal Minimal 5 karakter'}),
    kode_pos_tinggal: z.string({message: 'Kode Pos Tinggal Harus Diisi'})
        .min(5, {message: 'Harus 5 angka'})
        .max(5, {message: 'Harus 5 angka'}),
    rt_tinggal: z.string()
        .min(2, {message: 'Rt tinggal harus diisi minimal 2 angka'})
        .max(3, {message: 'Rt tinggal harus diisi maximal 3 angka'}),
    rw_tinggal: z.string()
        .min(2, {message: 'RW tinggal harus diisi minimal 2 angka'})
        .max(3, {message: 'RW tinggal harus diisi maximal 3 angka'}),
    tempat_lahir: z.string()
        .min(3, {message: 'Tempat Lahir Minimal 3 karakter'})
        .max(100, {message: 'Tempat Lahir maximal 100 karakter'}),
    id_jenis_kelamin: z.number(),
    id_ms_golongan_darah: z.number(),
    id_ms_status_kawin: z.number(),
    id_ms_agama: z.number(),
    hp: z.string().regex(/^\+?\d+$/, 'Invalid phone number format'),
    email: z.string().email().optional(),
    no_ktp: z.string()
        .max(16, {message: 'Nomor KTP harus 16 angka'})
        .min(16, {message: 'Nomor KTP harus 16 angka'}),
    status_pns: z.number(),
    status_aktif: z.number(),
    tgl_lahir: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
        message: 'Tanggal lahir harus diisi',
    }),
    tgl_masuk: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
        message: 'Tanggal Masuk harus diisi',
    }).nullable(),
    tgl_keluar: z.string().nullish(),
    foto: z.any().optional(),
    file_ktp: z.any().optional(),
    file_kk: z.any().optional(),
    file_ktam: z.any().optional(),
    file_npwp: z.any().optional(),
    id_pegawai: z.string().optional(),
    id_ms_pendidikan: z.number(),
    id_ms_status_pegawai: z.number(),
    id_ms_spesialis: z.number(),
    id_pangkat: z.number(),
    id_jabatan: z.number(),
    kode_dpjp: z.string().nullish(),
    id_unit_induk: z.number().optional(),
    id_unit_kerja: z.number().optional(),
    id_ms_jenis_pegawai: z.number(),
    id_ms_negara_asal: z.number().nullish(),
    id_ms_provinsi_asal: z.string().nullish(),
    id_ms_kota_asal: z.string().nullish(),
    id_ms_kecamatan_asal: z.string().nullish(),
    id_ms_desa_asal: z.string().nullish(),
    rt_asal: z.string().nullish(),
    rw_asal: z.string().nullish(),
    kode_pos_asal: z.string().nullish(),
    alamat_asal: z.string().nullish(),
});

export {employeeValidationSchema};
