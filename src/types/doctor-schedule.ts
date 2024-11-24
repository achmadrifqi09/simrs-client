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
    kuota_onsite: number
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
    kuota_tambahan?: AdditionalQuota[]
};

type AdditionalQuota = {
    kuota_mjkn: number;
    kuota_online_umum: number;
    kuota_onsite: number;
    tanggal_diterapkan: string | null;
}
type AdditionalQuotaPayload = {
    id_kuota_tambahan: number;
    kuota_mjkn: number;
    kuota_online_umum: number;
    kuota_onsite: number;
    tanggal_diterapkan: string | null;
}

type DoctorScheduleWithPagination = {
    results: DoctorSchedule[]
    pagination: {
        current_cursor: number;
        take: number
    }
}

type PracticeHours = {
    id_jadwal_dokter: number;
    jam_buka_praktek: Date;
    jam_tutup_praktek: Date;
}

type SchedulesPerDayOrPerDate = {
    jenis_jadwal: number;
    hari_praktek: number | null;
    tgl_praktek: Date;
    tanggal_libur: Date | null;
    jam_praktek: PracticeHours[];
}

interface DoctorPracticeSchedule {
    id_dokter: number | null;
    nama_dokter: string;
    gelar_depan: string;
    gelar_belakang: string;
    jadwal: SchedulesPerDayOrPerDate[];
}


export type {
    DoctorSchedulePayload,
    DoctorSchedule,
    DoctorScheduleWithPagination,
    AdditionalQuota,
    AdditionalQuotaPayload,
    SchedulesPerDayOrPerDate,
    DoctorPracticeSchedule,
    PracticeHours
}
