export interface Employee {
    id_pegawai: number | undefined;
    nama_pegawai: string;
    nip_pegawai: string;
    nip_pns: string;
    gelar_depan: string;
    gelar_belakang: string;
    id_ms_negara_tinggal: number;
    id_ms_provinsi_tinggal: string;
    id_ms_kota_tinggal: string;
    id_ms_kecamatan_tinggal: string;
    id_ms_desa_tinggal: string;
    alamat_tinggal: string;
    kode_pos_tinggal: string;
    rt_tinggal: string;
    rw_tinggal: string;
    tempat_lahir: string;
    id_jenis_kelamin: number;
    id_ms_golongan_darah: number;
    id_ms_status_kawin: number;
    id_ms_agama: number;
    hp: string;
    email: string;
    no_ktp: string;
    status_pns?: number;
    status_aktif?: number;
    tgl_lahir: string;
    tgl_masuk: string;
    // tgl_keluar?: string;
    tgl_keluar?: string | null;
    foto?: File;
    file_ktp?: File;
    file_kk?: File;
    file_ktam?: File;
    file_npwp?: File;
    id_ms_pendidikan: number;
    id_ms_status_pegawai: number;
    id_ms_spesialis: number;
    id_pangkat: number;
    id_jabatan: number;
    kode_dpjp: string;
    unit_induk?: EmployeesParentUnit
    nama_jenis_pegawai?: EmployeesType;
    unit_kerja?: EmployeesWorkUnit;
}

export type EmployeePagination = {
    results: Employee[]
    pagination: Pagination
}

type Pagination = {
    current_cursor: number;
    take: number
}

type EmployeesType = {
    id_ms_jenis_pegawai: number;
    nama_jenis_pegawai: string;
}

type EmployeesParentUnit = {
    id_unit_induk: number;
    nama_unit_kerja: string;
}

type EmployeesWorkUnit = {
    id: number;
    nama_unit_kerja: string;
}


export type EmployeeSubmitPayload = {
    nama_pegawai: string;
    nip_pegawai: string;
    nip_pns: string;
    gelar_depan: string;
    gelar_belakang: string;
    id_ms_negara_tinggal: number;
    id_ms_provinsi_tinggal: string;
    id_ms_kota_tinggal: string;
    id_ms_kecamatan_tinggal: string;
    id_ms_desa_tinggal: string;
    alamat_tinggal: string;
    kode_pos_tinggal: string;
    rt_tinggal: string;
    rw_tinggal: string;
    tempat_lahir: string;
    id_jenis_kelamin: number;
    id_ms_golongan_darah: number;
    id_ms_status_kawin: number;
    id_ms_agama: number;
    hp: string;
    email: string;
    no_ktp: string;
    status_pns?: number;
    status_aktif?: number;
    tgl_lahir: string;
    tgl_masuk: string;
    // tgl_keluar?: string;
    tgl_keluar?: string | null;
    foto?: File;
    file_ktp?: File;
    file_kk?: File;
    file_ktam?: File;
    file_npwp?: File;
    id_ms_pendidikan: number;
    id_ms_status_pegawai: number;
    id_ms_spesialis: number;
    id_pangkat: number;
    id_jabatan: number;
    kode_dpjp?: string | null;
    id_ms_unit_induk: number
    id_ms_unit_kerja: number;
    id_ms_jenis_pegawai: number;
}

export type EmployeeSingle = {
    id_pegawai: number;
    nama_pegawai: string;
    nip_pegawai: string;
    nip_pns: string;
    gelar_depan: string;
    gelar_belakang: string;
    id_ms_negara_tinggal: number;
    id_ms_provinsi_tinggal: string;
    id_ms_kota_tinggal: string;
    id_ms_kecamatan_tinggal: string;
    id_ms_desa_tinggal: string;
    alamat_tinggal: string;
    kode_pos_tinggal: string;
    rt_tinggal: string;
    rw_tinggal: string;
    tempat_lahir: string;
    id_jenis_kelamin: number;
    id_ms_golongan_darah: number;
    id_ms_status_kawin: number;
    id_ms_agama: number;
    hp: string;
    email: string;
    no_ktp: string;
    status_pns?: number;
    status_aktif?: number;
    tgl_lahir: string;
    tgl_masuk: string;
    tgl_keluar?: string;
    foto?: File;
    file_ktp?: File;
    file_kk?: File;
    file_ktam?: File;
    file_npwp?: File;
    id_ms_pendidikan: number;
    id_ms_status_pegawai: number;
    id_ms_spesialis: number;
    id_pangkat: number;
    id_jabatan: number;
    kode_dpjp: string;
    id_ms_unit_induk: number;
    id_ms_unit_kerja: number;
    id_ms_jenis_pegawai: number;
    id_unit_induk:number;
    id_unit_kerja: number;
}
