type WorkUnits = {
    pagination: Pagination
    results: WorkUnit[]
}

type WorkUnit = {
    id?: number;
    nama_unit_kerja: string;
    jenis_pelayanan: number;
    kode_instalasi_bpjs?: string;
    status_antrian: number;
    id_unit_induk?: number;
    status: number;
}

type ParentUnit = {
    id?: string;
    nama_unit_kerja: string;
    jenis_pelayanan: number;
    status: number;
    is_parent_unit: number;
    status_antrian: number;
    id_bidang: number;
    kode_instalasi_bpjs: string | null | undefined;
}

type Subunit = {
    id?: number;
    nama_unit_kerja: string;
    jenis_pelayanan: number;
    status: number;
    is_parent_unit: number;
    status_antrian: number;
    id_bidang: number;
    kode_instalasi_bpjs?: string | undefined;
    id_unit_induk?: number;
}

type Pagination = {
    current_cursor: number;
    take: number
}
type Subunits = {
    pagination: Pagination
    results: Subunit[]
}

type FieldOfWorkUnit = {
    id?: number,
    nama_bidang: string;
    status: number;
}

export type {WorkUnit, FieldOfWorkUnit, ParentUnit, Subunit, Subunits, WorkUnits}
