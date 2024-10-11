import z from 'zod'

const religionValidation = z.object({
    nama_agama: z.string({message: 'Nama agama harus di isi'}).min(4, {message: 'Nama agama minimal 4 karakter'}),
    status: z.string({message: 'Status agama harus di isi'})
})

const bloodTypeValidation = z.object({
    nama_golongan_darah: z.string({message: 'Nama golongan darah harus di isi'})
        .min(1, {message: 'Nama golongan darah minimal 1 karakter'})
        .max(2, {message: 'Nama golongan darah maksimal 2 karakter'}),
    status: z.string({message: 'Status golongan darah harus di isi'})
})

const structuralPositionValidation = z.object({
    nama_jabatan: z.string({message: 'Nama jabatan harus di isi'})
        .min(4, {message: 'Nama jabatan minimal 4 karakter'})
        .max(200, {message: 'Nama jabatan maksimal 200 karakter'}),
    status: z.string({message: 'Status jabatan harus di isi'})
})

const maritalStatusValidation = z.object({
    nama_status_kawin: z.string({message: 'Nama status perkawinan harus di isi'})
        .min(4, {message: 'Nama status perkawinan minimal 4 karakter'})
        .max(50, {message: 'Nama status perkawinan maksimal 50 karakter'}),
    status: z.string({message: 'Status harus di isi'})
})
const countryValidation = z.object({
    nama: z.string({message: 'Nama negara harus di isi'})
        .min(3, {message: 'Nama negara harus di isi minimal 4'})
        .max(50, {message: 'Nama negara harus di isi maximal 50'}),
    status: z.string({message: 'Status harus di isi'})
})

const employeeStatusValidation = z.object({
    nama_status_pegawai: z.string({message: 'Nama pegawai harus di isi'})
        .min(4, {message: 'Nama pegawai harus di isi minimal 4 karakter'})
        .max(50, {message: 'Nama pegawai harus di isi maximal 4 karakter'}),
    status: z.string({message: 'Status harus di isi'})
})

const rankOrClassValidation = z.object({
    nama_pangkat: z.string({message: 'Nama pangkat harus di isi'})
        .min(4, {message: 'Nama pangkat harus di isi minimal 4 karakter'})
        .max(50, {message: 'Nama pangkat harus di isi maximal 4 karakter'}),
    status: z.string({message: 'Status harus di isi'})
})

const doctorSpecialistValidation = z.object({
    nama_spesialis: z.string({message: 'Nama pangkat harus di isi'})
        .min(4, {message: 'Nama pangkat harus di isi minimal 4 karakter'})
        .max(50, {message: 'Nama pangkat harus di isi maximal 4 karakter'}),
    status: z.string({message: 'Status harus di isi'})
})

const positionValidation = z.object({
    nama_jabatan: z.string({message: 'Nama pangkat harus di isi'})
        .min(2, {message: 'Nama pangkat harus di isi minimal 2 karakter'})
        .max(50, {message: 'Nama pangkat harus di isi maximal 50 karakter'}),
    status: z.string({message: 'Status harus di isi'})
})

const provinceValidation = z.object({
    nama: z.string({message: 'Nama provinsi harus diisi'})
        .min(4, {message: 'Nama Provinsi minimal 4 karakter'})
        .max(50, {message: 'Nama Provinsi harus diisi maksimal 50'}),
    id_negara: z.number({message: 'Negara harus diisi'}),
    id: z.string({message: 'Kode wilayah provinsi harus diisi'})
        .max(2, {message: 'Kode wilayah maksimal 2 digit'})
        .regex(/^\d+$/, {message: 'Kode wilayah provinsi harus berupa angka'}) // Regex to ensure only digits
})
const regencyValidation = z.object({
    nama: z.string({message: 'Nama kecamatan/kota harus diisi'})
        .min(4, {message: 'Nama kecamatan/kota minimal 4 karakter'})
        .max(50, {message: 'Nama kecamatan/kota harus diisi maksimal 50'}),
    id_provinsi: z
        .string({message: 'Provinsi harus diisi'})
        .min(2, {message: 'Kode provinsi harus 2 digit'})
        .max(2, {message: 'Kode provinsi harus 2 digit'}),
    id: z.string({message: 'Kode kecamatan/kota provinsi harus diisi'})
        .min(4, {message: 'Kode kecamatan/kota maksimal 4 digit'})
        .max(4, {message: 'Kode kecamatan/kota maksimal 4 digit'})
        .regex(/^\d+$/, {message: 'Kode kecamatan/kota provinsi harus berupa angka'}) // Regex to ensure only digits
})

export {
    religionValidation,
    bloodTypeValidation,
    structuralPositionValidation,
    maritalStatusValidation,
    countryValidation,
    employeeStatusValidation,
    rankOrClassValidation,
    doctorSpecialistValidation,
    positionValidation,
    provinceValidation,
    regencyValidation
}
