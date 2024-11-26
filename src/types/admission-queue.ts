type AdmissionQueues = {
    pagination: {
        "current_cursor": number,
        "take": number
    }
    results: AdmissionQueue[]
}

type AdmissionQueue = {
    kode_rm: number,
    no_hp: number,
    no_bpjs: number,
    no_rujukan: number,
    id_antrian: number;
    status_panggil: number;
    jenis_pasien: number;
    jenis_penjamin: number;
    kode_antrian: string;
    no_antrian: number;
    nama_pasien: string;
    jadwal_dokter: DoctorSchedule
}

type AdmissionQueueWS = {
    id_antrian: number;
    id_ms_loket_antrian: number;
    jadwal_dokter: DoctorSchedule
    jenis_pasien: number;
    jenis_penjamin: number;
    kode_antrian: string;
    nama_pasien: string;
    no_antrian: number;
    status_panggil: number;
}

type DoctorSchedule = {
    id_jadwal_dokter: string;
    jam_buka_praktek: Date;
    jam_tutup_praktek: Date;
    kode_instalasi_bpjs: string;
    pegawai: Employee
}

type Employee = {
    nama_pegawai: string;
    gelar_depan: string;
    gelar_belakang: string;
}

type QueueDisplay = {
    id_antrian: number;
    kode_antrian: string;
    no_antrian: number;
}

type CounterDisplayWS = {
    id_ms_loket_antrian: number;
    jenis_loket: number;
    nama_loket: string;
    antrian: QueueDisplay[]
}

export type {AdmissionQueueWS, CounterDisplayWS, AdmissionQueues, AdmissionQueue}