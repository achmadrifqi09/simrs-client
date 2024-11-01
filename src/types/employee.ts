type Pagination = {
    current_cursor: number;
    take: number
}

type EmployeePagination = {
    pagination: Pagination;
    results: Employee[];
}

type EmployeeRelation = {
    id?: number;
    nama: string;
};

type Employee = {
    id_pegawai: number;
    no_reg: string;
    nip_pegawai?: number;
    nip_pns?: number;
    gelar_depan: string;
    gelar_belakang: string;
    nama_pegawai: string;
    id_ms_negara_asal?: EmployeeRelation;
    id_ms_provinsi_asal?: EmployeeRelation;
    id_ms_kota_asal?: EmployeeRelation;
    id_ms_kecamatan_asal?: EmployeeRelation;
    id_ms_desa_asal?: EmployeeRelation;
    alamat_asal?: string;
    kode_pos_asal?: string;
    rt_asal?: string;
    rw_asal?: string;
    id_ms_negara_tinggal: EmployeeRelation;
    id_ms_provinsi_tinggal: EmployeeRelation;
    id_ms_kota_tinggal: EmployeeRelation;
    id_ms_kecamatan_tinggal: EmployeeRelation;
    id_ms_desa_tinggal: EmployeeRelation;
    alamat_tinggal: string;
    kode_pos_tinggal?: string;
    rt_tinggal?: string;
    rw_tinggal?: string;
    tempat_lahir: string;
    tgl_lahir: Date;
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
    no_npwp?: string;
    no_ktp: string;
    foto?: string;
    kode_arsip?: string;
    id_finger: string;
    kode_dpjp?: string;
    tgl_masuk: Date;
    tgl_keluar?: Date;
    status_pns: number;
    status_aktif: number;
    id_pelamar: number;
};

export type {
    EmployeeRelation,
    Employee,
    EmployeePagination

}
