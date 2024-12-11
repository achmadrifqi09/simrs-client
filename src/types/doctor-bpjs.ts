import DoctorBPJS from '@/app/(root)/bpjs/doctor/component/doctor-bpjs';

export type DoctorsBPJS = {
    list: DoctorBPJS[];
};

export type DoctorBPJS = {
    namadokter: string;
    kodedokter: string;
};

export type DoctorBPJSFilters = {
    specialist: string | null;
    service_date: string | null;
    service_type: number | null;
};

export type InternalDoctors = {
    results: InternalDoctor[];
};

export type InternalDoctor = {
    id_pegawai: number;
    nama_pegawai: string;
    kode_dpjp: string;
    gelar_belakang: string;
    gelar_depan: string;
};
