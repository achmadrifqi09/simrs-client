import { Insurance } from '@/types/master';
import { RegistrationFee } from './registration-fee';

type RegisterResult = {
    id: number;
    kode_rm?: string;
    status_bpjs: number;
    antrian: QueueRegister;
    tgl_daftar: string;
    nomor_registrasi: string;
    status_batal: number;
    status_kirim_bpjs: number;
};

type QueueWithRegistrationFromWs = {
    data: {
        kode_rm: string | null;
        id_antrian: number;
        jenis_pasien: number;
        id_pendaftaran: number | null;
    };
};

type Registration = {
    id: number;
    kode_rm?: string;
    status_bpjs: number;
    tgl_daftar?: string;
    nomor_registrasi: string;
    no_rujukan: string;
    status_rujukan: number;
    nomor_asuransi?: string;
    id_asuransi?: number;
    nomor_rujuk_balik: string;
    no_sep: string;
    cob: number;
    status_kirim_bpjs: number;
    no_cob: string;
    nama_wali: string;
    telp_wali: string;
    antrian: QueueRegister;
    biaya_pendaftaran?: RegistrationFee;
    nomor_antrian_poli?: number;
    kode_antrian_poli?: string;
    modified_at?: Date;
    asuransi?: Insurance;
    task_id_terakhir?: number;
    hub_wali?: {
        id: number;
        nama_status_keluarga: string;
    };
};

type QueueRegister = {
    id_antrian: number;
    nama_pasien: string;
    jenis_pasien: number;
    jenis_penjamin: number;
    no_antrian: number;
    kode_antrian: string;
    jadwal_dokter: DoctorScheduleRegister;
};

type DoctorScheduleRegister = {
    unit: {
        nama_unit_kerja: string;
        kode_instalasi_bpjs: string;
    };
    pegawai: {
        nama_pegawai: string;
        gelar_depan: string | null;
        gelar_belakang: string | null;
        kode_dpjp: string | null;
    };
    jam_buka_praktek: Date;
    jam_tutup_praktek: Date;
};

type PaginationRegister = {
    current_cursor: number;
    take: number;
};

type Register = {
    results: RegisterResult[];
    pagination: PaginationRegister;
};

export type { Register, DoctorScheduleRegister, RegisterResult, Registration, QueueWithRegistrationFromWs };
