type DoctorSchedulePayload = {
    id_pegawai: number;
    kode_instalasi_bpjs: string;
    jenis_jadwal: number;
    hari_praktek?: number | undefined | string;
    tgl_praktek?: Date | undefined | string;
    jam_buka_praktek: string;
    jam_tutup_praktek: string;
    kuota_mjkn: number;
    kuota_online_umum: number;
    kuota_onsite: number;
};

type DoctorSchedule = {
    id_jadwal_dokter: number;
    id_pegawai: number;
    kode_instalasi_bpjs: string;
    jenis_jadwal: number;
    hari_praktek: number;
    tgl_praktek: string | null;
    jam_buka_praktek: string;
    jam_tutup_praktek: string;
    kuota_online_umum: number;
    kuota_mjkn: number;
    kuota_onsite: number;
    tanggal_libur: string | null;
    keterangan_libur: string | null;
    unit?: {
        id: number;
        nama_unit_kerja: string;
    };
    pegawai?: {
        id_pegawai: number;
        nama_pegawai: string;
        gelar_depan: string | null;
        gelar_belakang: string | null;
    };
};

type DoctorScheduleWithPagination = {
    results: DoctorSchedule[]
    pagination: {
        current_cursor: number;
        take: number
    }
}

export type { DoctorSchedulePayload, DoctorSchedule, DoctorScheduleWithPagination }
