
type PatientType = {
    id_pasien: number;
    kode_rm: string;
    nama_pasien: string;
    tempat_lahir: string;
    tgl_lahir: Date;
    jenis_kelamin: number;
    id_warga_negara: number;
    identitas_pasien: number;
    no_identitas: string;
    no_bpjs: string;
    no_hp: string;
    id_ms_negara_tinggal: number;
    id_ms_provinsi_tinggal: string;
    id_ms_kota_tinggal: string;
    id_ms_kecamatan_tinggal: string;
    id_ms_desa_tinggal: string;
    alamat_tinggal: string;
    rt_tinggal: string;
    rw_tinggal: string;
    kode_pos_tinggal?: string;
    alamatgab_tinggal: string;
    suku?: string;
    nama_ibu_kandung?: string;
    id_ms_status_kawin?: number;
    id_ms_golongan_darah?: number;
    id_ms_agama: number;
    live?: number;
    rt_asal: string;
    rw_asal: string;
    id_ms_negara_asal: number;
    id_ms_provinsi_asal: string;
    id_ms_kota_asal: string;
    id_ms_kecamatan_asal: string;
    id_ms_desa_asal: string;
    alamat_asal: string;
    alamatgab_asal: string;
    nama_pekerjaan?: string;
    kode_pos_asal?: string;
    id_ms_pendidikan: number;
    created_by?: number;
    created_at?: Date;
    modified_at?: Date;
    modified_by?: number;
    deleted_at?: Date;
};

type PatientTypePagination = {
    results: PatientType[]
    pagination: {
        current_cursor: number;
        take: number
    }
}
export type {
    PatientType,
    PatientTypePagination
};
