type EmployeePagination = {
    results: Employee[]
    pagination: {
        current_cursor: number;
        take: number
    }
}

type EmployeeRelation = {
    id?: number;
    nama: string;
};

type Employee = {
    id_pegawai: number;
    no_reg: string;
    nip_pegawai?: string;
    nip_pns?: string;
    gelar_depan?: string;
    gelar_belakang?: string;
    nama_pegawai: string;
    id_ms_negara_asal: number;
    id_ms_provinsi_asal: number;
    id_ms_kota_asal: number;
    id_ms_kecamatan_asal: number;
    id_ms_desa_asal: number;
    alamat_asal?: string;
    kode_pos_asal?: number;
    rt_asal?: number;
    rw_asal?: number;
    id_ms_negara_tinggal: number;
    id_ms_provinsi_tinggal: number;
    id_ms_kota_tinggal: number;
    id_ms_kecamatan_tinggal: number;
    id_ms_desa_tinggal: number;
    alamat_tinggal: string;
    kode_pos_tinggal: number;
    rt_tinggal: number;
    rw_tinggal: number;
    tempat_lahir: string;
    tgl_lahir: Date | undefined | string;
    id_jenis_kelamin: number;
    id_ms_golongan_darah?: number;
    id_ms_status_kawin: number;
    id_ms_agama: number;
    id_ms_pendidikan: number;
    id_ms_jenis_pegawai: number;
    id_ms_status_pegawai: number;
    id_ms_spesialis?: number;
    id_unit_induk: number;
    id_pangkat: number;
    id_jabatan: number;
    id_unit_jabatan: number;
    id_gaji?: number;
    pjs?: number;
    hp: string;
    email: string;
    no_npwp: number;
    no_ktp: number;
    no_ktam: number;
    foto?: string;
    kode_arsip?: string;
    id_finger: string;
    kode_dpjp?: string;
    tgl_masuk: Date | undefined | string;
    tgl_keluar?: Date | undefined | string;
    status_pns: number;
    status_aktif: number;
    id_pelamar?: number;
    file_ktp?: string;
    file_kk?: string;
    file_ktam?: string;
    file_npwp?: string;
    created_at: Date | undefined | string;
    created_by: number;
    modified_at?: Date | undefined | string;
    modified_by?: number;
    deleted_at?: Date | undefined | string;
    deleted_by?: number;
    restored_at?: Date | undefined | string;
    restored_by?: number;
    is_deleted: boolean;
    is_restored: boolean;
    jadwal_dokter: EmployeeRelation;
};


export type {
    EmployeeRelation,
    Employee,
    EmployeePagination
}
