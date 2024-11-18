import z from "zod";
const phoneNumberRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
const dateValidation = z
    .string()
    .transform((val) => {
        if (/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/.test(val)) {
            const [day, month, year] = val.split('-');
            val = `${year}-${month}-${day}`;
        }
        return new Date(val);
    });
const patientValidation = z.object({
    kode_rm:z.string()
        .max(20, {message: 'Kode RM maksimal 20 karakter'}),
    nama_pasien: z.string()
        .max(100, {message: 'Nama Pasien maksimal 100 karakter'}),
    tempat_lahir: z.string()
        .max(100, {message: 'Tempat Lahir maksimal 100 karakter'}),
    tgl_lahir: dateValidation,
    jenis_kelamin: z.number()
        .int()
        .min(1)
        .max(2, {message: 'Jenis Kelamin harus 1 ( laki-laki ) atau 2 ( perempuan )'}),
    id_warga_negara: z.number().int(),
    identitas_pasien: z.number().int(),
    no_identitas: z
        .string()
        .max(100, 'No Identitas tidak boleh melebihi 100 karakter'),
    no_bpjs: z.string().max(50, 'No BPJS tidak boleh melebihi 50 karakter'),
    no_hp: z
        .string()
        .regex(phoneNumberRegex, 'No HP harus berupa nomor telepon yang valid')
        .max(20),
    id_ms_negara_tinggal: z.number().int(),
    id_ms_provinsi_tinggal: z.string(),
    id_ms_kota_tinggal: z.string(),
    id_ms_kecamatan_tinggal: z.string(),
    id_ms_desa_tinggal: z.string(),
    alamat_tinggal: z.string(),
    rt_tinggal: z.string().max(5),
    rw_tinggal: z.string().max(5),
    kode_pos_tinggal: z.string().max(10).optional(),
    alamatgab_tinggal: z.string(),
    suku: z.string().max(50).optional(),
    nama_ibu_kandung: z.string().max(100).optional(),
    id_ms_status_kawin: z.number().int().default(0),
    id_ms_golongan_darah: z.number().int().default(0),
    id_ms_agama: z.number().int(),
    live: z.number().int().default(1),
    id_ms_negara_asal: z.number().int(),
    id_ms_propinsi_asal: z.string(),
    id_ms_kota_asal: z.string(),
    id_ms_kecamatan_asal: z.string(),
    id_ms_desa_asal: z.string(),
    alamat_asal: z.string(),
    alamatgab_asal: z.string(),
    rt_asal: z.string().max(5),
    rw_asal: z.string().max(5),
    nama_pekerjaan: z.string().max(100),
    kode_pos_asal: z.string().max(100),
    id_ms_pendidikan: z.number().max(100),
})

export {
    patientValidation
}
