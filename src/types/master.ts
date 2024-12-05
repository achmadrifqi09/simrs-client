type Religion = {
    id_ms_agama?: number;
    nama_agama: string;
    status: number;
};

type BloodType = {
    id_ms_golongan_darah?: number;
    nama_golongan_darah: string;
    status: number;
};

type StructuralPosition = {
    id_ms_jabatan?: number;
    nama_jabatan: string;
    status: number;
};

type MaritalStatus = {
    id_ms_status_kawin?: number;
    nama_status_kawin: string;
    status: number;
};

type Country = {
    id: number;
    nama: string;
    status: number;
};

type EmployeeStatus = {
    id_ms_status_pegawai: number;
    nama_status_pegawai: string;
    status: number;
}
type RankOrClass = {
    id_ms_pangkat: number;
    nama_pangkat: string;
    status: number;
}
type EmployeeCategory = {
    id_ms_jenis_pegawai_status: number;
    status_jenis_pegawai: string;
    kode_nip: number;
    status: number;
}
type EmployeeTypeRelation = {
    id_ms_jenis_pegawai_status: string;
    id_ms_jenis_pegawai: number;
}
type EmployeeType = {
    id_ms_jenis_pegawai_status: number;
    id_ms_jenis_pegawai: EmployeeTypeRelation;
    nama_jenis_pegawai: string;
    status_jenis_pegawai: EmployeeCategory;
    status: number;
}

type DoctorSpecialist = {
    id_ms_spesialis: number;
    nama_spesialis: string;
    status: number;
}


type ProvinceRelation = {
    nama: string
}

type Pagination = {
    current_cursor: number;
    take: number
}

type Province = {
    id: number;
    nama: string;
    id_negara: number;
    ms_negara?: ProvinceRelation
}

type Provinces = {
    pagination: Pagination
    results: Province[]
}

type RegencyRelation = {
    id: number;
    nama: string;
}

type Regency = {
    id: string;
    id_provinsi: string;
    nama: string;
    ms_provinsi?: RegencyRelation;
}

type Regencies = {
    pagination: Pagination,
    results: Regency[];
}

type DistrictRelation = {
    id: number;
    nama: string;
}
type District = {
    id: string;
    id_kabkot: string;
    nama: string;
    ms_kabkot?: DistrictRelation
}

type Districts = {
    pagination: Pagination;
    results: District[];
}

type VillageRelation = {
    id: number;
    nama: string;
}
type Village = {
    id: string;
    id_kecamatan: string;
    nama: string;
    ms_kecamatan?: VillageRelation
}
type Villages = {
    pagination: Pagination;
    results: Village[];
}

type Education = {
    id_ms_tingkat_pendidikan: number;
    nama_tingkat_pendidikan: string;
    status: number;
}

type FamilyStatus = {
    id: number;
    nama_status_keluarga: string;
    status: number;
}

type SocialStatus = {
    id: number;
    nama_status_sosial: string;
    status: number;
}

type RoomClass = {
    id: number;
    nama_kelas_kamar: string;
    kode_bpjs_kamar: string;
    status: number;
}

type RoomTypeRelation = {
    id: number;
    nama_kelas_kamar: string;
}
type RoomType = {
    id: number;
    id_kamar_kelas: number;
    nama_jenis_kamar: string;
    id_kelas_kamar?: RoomTypeRelation;
    kelas_kamar?: RoomTypeRelation,
    status: number;
}
type Building = {
    id: number;
    nama_gedung: string;
    status: number;
}

type BedRelation = {
    id: number;
    nama_kamar: string;
    lantai: number;
    jenis_kamar?: RoomRelation;
    gedung?: RoomRelation;
    total_bed: number;
    status: number;
}
type Bed = {
    id: number;
    id_ms_kamar?: BedRelation;
    kamar?: BedRelation;
    nama_bed: string;
    keterangan: string;
    status_bed: number;
    status: number;
}
type Beds = {
    pagination: Pagination;
    results: Bed[];
}

type RoomRelation = {
    id: number;
    nama_jenis_kamar: string;
    nama_gedung: string;
}
type Room = {
    id: number;
    jenis_kamar?: RoomRelation;
    nama_jenis_kamar?: RoomRelation,
    gedung?: RoomRelation;
    lantai: number;
    nama_kamar?: string;
    status: number;
    total_bed: number;
    room_id: number;
}
type Insurance = {
    id : number;
    nama_asuransi: string;
    status: number;
}



export type {
    Religion,
    BloodType,
    StructuralPosition,
    MaritalStatus,
    Country,
    EmployeeStatus,
    RankOrClass,
    DoctorSpecialist,
    Provinces,
    Province,
    Regency,
    Regencies,
    Districts,
    DistrictRelation,
    District,
    Villages,
    Village,
    VillageRelation,
    EmployeeCategory,
    Education,
    FamilyStatus,
    SocialStatus,
    RoomClass,
    RoomType,
    RoomTypeRelation,
    Building,
    Beds,
    Bed,
    BedRelation,
    RoomRelation,
    Room,
    EmployeeType,
    EmployeeTypeRelation,
    Insurance
};
