type ReligionDTO = {
    id_ms_agama?: number;
    nama_agama: string;
    status: number;
};

type BloodTypeDTO = {
    id_ms_golongan_darah?: number;
    nama_golongan_darah: string;
    status: number;
};

type StructuralPositionDTO = {
    id_ms_jabatan?: number;
    nama_jabatan: string;
    status: number;
};

type MaritalStatusDTO = {
    id_ms_status_kawin?: number;
    nama_status_kawin: string;
    status: number;
};
type CountryDTO = {
    id: number;
    nama: string;
    status: number;
};

type EmployeeStatusDTO = {
    id_ms_status_pegawai: number;
    nama_status_pegawai: string;
    status: number;
}
type RankOrClassDTO = {
    id_ms_pangkat: number;
    nama_pangkat: string;
    status: number;
}

type DoctorSpecialistDTO = {
    id_ms_spesialis: number;
    nama_spesialis: string;
    status: number;
}

type PositionDTO = {
    id_ms_jabatan: number;
    nama_jabatan: string;
    status: number;
}

type ProvinceDTO = {
    id: number;
    nama: string;
    status: number;
}

type PaginationDTO = {
    current_cursor: number,
    take: number
}

type ProvincesDTO = {
    pagination: PaginationDTO
    results: ProvinceDTO[]
}

export type {
    ReligionDTO,
    BloodTypeDTO,
    StructuralPositionDTO,
    MaritalStatusDTO,
    CountryDTO,
    EmployeeStatusDTO,
    RankOrClassDTO,
    DoctorSpecialistDTO,
    PositionDTO,
    ProvincesDTO,
    ProvinceDTO
};
