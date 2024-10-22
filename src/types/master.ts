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
type EmployeeCategoryDTO = {
    id_ms_jenis_pegawai_status: number;
    status_jenis_pegawai: string;
    status: number;
}
type EmployeeTypeRelationDTO = {
    id_ms_jenis_pegawai_status: string;
    id_ms_jenis_pegawai: number;
}
type EmployeeTypeDTO = {
    id_ms_jenis_pegawai_status: number;
    id_ms_jenis_pegawai: EmployeeTypeRelationDTO;
    nama_jenis_pegawai: string;
    status_jenis_pegawai: EmployeeCategoryDTO;
    status: number;
}

type DoctorSpecialistDTO = {
    id_ms_spesialis: number;
    nama_spesialis: string;
    status: number;
}


type ProvinceRelationDTO = {
    nama: string
}

type PaginationDTO = {
    current_cursor: number;
    take: number
}

type ProvinceDTO = {
    id: number;
    nama: string;
    id_negara: number;
    ms_negara?: ProvinceRelationDTO
}

type ProvincesDTO = {
    pagination: PaginationDTO
    results: ProvinceDTO[]
}

type RegencyRelationDTO = {
    id: number;
    nama: string;
}

type RegencyDTO = {
    id: string;
    id_provinsi: string;
    nama: string;
    ms_provinsi?: RegencyRelationDTO;
}

type RegenciesDTO = {
    pagination: PaginationDTO,
    results: RegencyDTO[];
}

type DistrictRelationDTO = {
    id: number;
    nama: string;
}
type DistrictDTO = {
    id: string;
    id_kabkot: string;
    nama: string;
    ms_kabkot?: DistrictRelationDTO
}

type DistrictsDTO = {
    pagination: PaginationDTO;
    results: DistrictDTO[];
}

type VillageRelationDTO = {
    id: number;
    nama: string;
}
type VillageDTO = {
    id: string;
    id_kecamatan: string;
    nama: string;
    ms_kecamatan?: VillageRelationDTO
}
type VillagesDTO = {
    pagination: PaginationDTO;
    results: VillageDTO[];
}

type EducationDTO = {
    id_ms_tingkat_pendidikan: number;
    nama_tingkat_pendidikan: string;
    status: number;
}

type FamilyStatusDTO = {
    id: number;
    nama_status_keluarga: string;
    status: number;
}

type SocialStatusDTO = {
    id: number;
    nama_status_sosial: string;
    status: number;
}

type RoomClassDTO = {
    id: number;
    nama_kelas_kamar: string;
    kode_bpjs_kamar: string;
    status: number;
}

type RoomTypeRelationDTO = {
    id: number;
    nama_kelas_kamar: string;
}
type RoomTypeDTO = {
    id: number;
    id_kamar_kelas: number;
    nama_jenis_kamar: string;
    id_kelas_kamar?: RoomTypeRelationDTO;
    kelas_kamar?: RoomTypeRelationDTO,
    status: number;
}
type BuildingDTO = {
    id: number;
    nama_gedung: string;
    status: number;
}

type BedRelationDTO = {
    id: number;
    nama_kamar: string;
    lantai: number;
    jenis_kamar?: RoomRelationDTO;
    gedung?: RoomRelationDTO;
    total_bed: number;
    status: number;
}
type BedDTO = {
    id: number;
    id_ms_kamar?: BedRelationDTO;
    kamar?: BedRelationDTO;
    nama_bed: string;
    keterangan: string;
    status_bed: number;
    status: number;
}
type BedsDTO = {
    pagination: PaginationDTO;
    results: BedDTO[];
}

type RoomRelationDTO = {
    id: number;
    nama_jenis_kamar: string;
    nama_gedung: string;
}
type RoomDTO = {
    id: number;
    jenis_kamar?: RoomRelationDTO;
    nama_jenis_kamar?: RoomRelationDTO,
    gedung?: RoomRelationDTO;
    lantai: number;
    nama_kamar?: string;
    status: number;
    total_bed: number;
    room_id: number;
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
    ProvincesDTO,
    ProvinceDTO,
    RegencyDTO,
    RegenciesDTO,
    DistrictsDTO,
    DistrictRelationDTO,
    DistrictDTO,
    VillagesDTO,
    VillageDTO,
    VillageRelationDTO,
    EmployeeCategoryDTO,
    EducationDTO,
    FamilyStatusDTO,
    SocialStatusDTO,
    RoomClassDTO,
    RoomTypeDTO,
    RoomTypeRelationDTO,
    BuildingDTO,
    BedsDTO,
    BedDTO,
    BedRelationDTO,
    RoomRelationDTO,
    RoomDTO,
    EmployeeTypeDTO,
    EmployeeTypeRelationDTO
};
