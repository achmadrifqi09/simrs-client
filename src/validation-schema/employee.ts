import z from "zod";

const employeeValidation = z.object({
    id_pegawai: z.number(),
    no_reg: z
        .string()
        .max(50, "No Reg maksimal 50 karakter"),
    nip_pegawai: z.number().max(50, "Nip Pegawai maksimal 50 karakter"),
    nip_pns: z.number().max(50, "Nip Pns maksimal 50 karakter"),
    gelar_depan: z.string().max(100, "Gelar Depan maksimal 100 karakter"),
    gelar_belakang: z.string().max(100, "Gelar Belakang maksimal 100 karakter"),
    nama_pegawai: z
        .string()
        .max(100, "Nama Pegawai maksimal 100 karakter"),
    id_ms_negara_asal: z.number(),
    id_ms_provinsi_asal: z.number(),
    id_ms_kota_asal: z.number(),
    id_ms_kecamatan_asal: z.number(),
    id_ms_desa_asal: z.number(),
    alamat_asal: z.string(),
    kode_pos_asal: z.string().max(10, "Kode Pos Asal maksimal 10 karakter"),
    rt_asal: z.string().max(5, "RT Asal maksimal 5 karakter"),
    rw_asal: z.string().max(5, "RW Asal maksimal 5 karakter"),
    id_ms_negara_tinggal: z.number(),
    id_ms_provinsi_tinggal: z.number(),
    id_ms_kota_tinggal: z.number(),
    id_ms_kecamatan_tinggal: z.number(),
    id_ms_desa_tinggal: z.number(),
    alamat_tinggal: z
        .string(),
    kode_pos_tinggal: z.string().max(10, "Kode Pos Tinggal maksimal 10 karakter"),
    rt_tinggal: z.string().max(3, "RT Tinggal maksimal 3 karakter"),
    rw_tinggal: z.string().max(3, "RW Tinggal maksimal 3 karakter"),
    tempat_lahir: z
        .string()
        .max(100, "Tempat Lahir maksimal 100 karakter"),
    tgl_lahir: z.date(),
    id_jenis_kelamin: z.number(),
    id_ms_golongan_darah: z.number(),
    id_ms_status_kawin: z.number(),
    id_ms_agama: z.number(),
    id_ms_pendidikan: z.number(),
    id_ms_jenis_pegawai: z.number(),
    id_ms_status_pegawai: z.number(),
    id_ms_spesialis: z.number(),
    id_unit_induk: z.number(),
    id_pangkat: z.number(),
    id_jabatan: z.number(),
    id_unit_jabatan: z.number(),
    id_gaji: z.number(),
    pjs: z.number(),
    hp: z
        .string()
        .max(15, "HP maksimal 15 karakter"),
    email: z
        .string()
        .max(100, "Email maksimal 100 karakter")
        .email("Format email tidak valid"),
    no_npwp: z.string().max(25, "No NPWP maksimal 25 karakter"),
    no_ktp: z
        .string()
        .max(25, "No KTP maksimal 25 karakter"),
    foto: z.string(),
    kode_arsip: z.string().max(20, "Kode Arsip maksimal 20 karakter"),
    id_finger: z.number({message: 'harus diisi'}),
    kode_dpjp: z.string().max(20, "Kode DPJP maksimal 20 karakter"),
    tgl_masuk: z.date(),
    tgl_keluar: z.date(),
    status_pns: z.number(),
    status_aktif: z.number(),
    id_pelamar: z.number(),
})

export {
    employeeValidation
}
