type RegisterResult = {
    id: number;
    kode_rm?: string;
    status_bpjs: number;
    antrian: QueueRegister;
    tgl_daftar: string;
    nomor_registrasi: string;
    status_batal: number;
}

type QueueRegister = {
    id_antrian: number;
    nama_pasien: string;
    jenis_pasien: number;
    jenis_penjamin: number;
    jadwal_dokter: DoctorScheduleRegister;
}
type DoctorScheduleRegister = {
    unit: {
        nama_unit_kerja: string;
    },
    pegawai: {
        nama_pegawai: string;
        gelar_depan: string | null;
        gelar_belakang: string | null;
    },
    jam_buka_praktek: Date;
    jam_tutup_praktek: Date;
}

type PaginationRegister = {
    current_cursor: number;
    take:number;
}

type Register = {
    results: RegisterResult[];
    pagination: PaginationRegister
}

export type {
    Register,
    DoctorScheduleRegister,
    RegisterResult,
}
