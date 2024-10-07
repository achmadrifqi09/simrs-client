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

export type {
    ReligionDTO,
    BloodTypeDTO,
    StructuralPositionDTO,
    MaritalStatusDTO
};