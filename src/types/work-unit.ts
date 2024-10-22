type WorkUnit = {
    id_unit_kerja?: number;
    nama_unit_kerja: string;
    jenis_pelayanan: number;
    kode_instalasi_bpjs?: string;
    status_antrian: number;
    id_unit_induk?: number;
    status: number;
}

type FieldOfWorkUnit = {
    id?: number,
    nama_bidang: string;
    status: number;
}

export type {WorkUnit, FieldOfWorkUnit}