type PolyclinicCounter = {
    id: number;
    nama_unit_kerja: string;
    kode_instalasi_bpjs: string;
    total_antrean: number;
    total_antrean_selesai: number;
};

type QueueUnit = {
    id: number;
    nama_unit_kerja: string;
    kode_instalasi_bpjs: string;
    "status_antrian": number,
    "status": number
}

export type {PolyclinicCounter, QueueUnit}
