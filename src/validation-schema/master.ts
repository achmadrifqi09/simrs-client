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
    nama: z.string({message: 'Nama Kabupaten/kota harus diisi'})
        .min(4, {message: 'Nama Kabupaten/kota minimal 4 karakter'})
        .max(50, {message: 'Nama Kabupaten/kota harus diisi maksimal 50'}),
    id_provinsi: z
        .string({message: 'Provinsi harus diisi'})
        .min(2, {message: 'Kode provinsi harus 2 digit'})
        .max(2, {message: 'Kode provinsi harus 2 digit'}),
    id: z.string({message: 'Kode Kabupaten/kota provinsi harus diisi'})
        .min(4, {message: 'Kode Kabupaten/kota maksimal 4 digit'})
        .max(4, {message: 'Kode Kabupaten/kota maksimal 4 digit'})
        .regex(/^\d+$/, {message: 'Kode Kabupaten/kota provinsi harus berupa angka'}) // Regex to ensure only digits
})

const districtValidation = z.object({
    id: z
        .string({message: 'Kode wilayah kecamatan harus diisi'})
        .min(6, {message: 'Kode wilayah kecamatan harus 6 digit'})
        .max(6, {message: 'Kode wilayah kecamatan harus 6 digit'}),
    nama: z
        .string({message: 'Nama kecamatan darah harus di isi'})
        .min(4, {message: 'Nama kecamatan minimal 4 karakter'}),
    id_kabkot: z
        .string({message: 'Kabupaten/kota harus diisi'})
        .min(4, {message: 'Kode kabupaten/kota harus 4 digit'})
        .max(4, {message: 'Kode kabupaten/kota harus 4 digit'}),
})
const villageValidation = z.object({
    id: z
        .string({message: 'Kode wilayah desa harus diisi'})
        .min(10, {message: 'Kode wilayah desa harus 10 digit'})
        .max(10, {message: 'Kode wilayah desa harus 10 digit'}),
    nama: z
        .string({message: 'Nama desa harus di isi'})
        .min(4, {message: 'Nama desa minimal 4 karakter'}),
    id_kecamatan: z
        .string({message: 'Kecamatan harus diisi'})
        .min(6, {message: 'Kode kecamatan harus 6 digit'})
        .max(6, {message: 'Kode kecamatan harus 6 digit'}),
})

const employeeTypeValidation = z.object({
    status_jenis_pegawai: z
        .string({message: 'ID Jenis Pegawai harus diisi'})
        .min(2, {message: 'ID Jenis Pegawai minimal 2'})
        .max(20, {message: 'ID Jenis Pegawai maximal 20'}),
    status: z.string({message: 'Status jabatan harus di isi'})
})

const educationLeveValidation = z.object({
    nama_tingkat_pendidikan: z
        .string({message: 'Nama Tingkat Pendidikan Harus diisi'}),
    status: z.string({message: 'Status Tingkat Pendidikan harus di isi'})
})

const familyStatusValidation = z.object({
    nama_status_keluarga: z
        .string({message: 'Nama Status Keluarga Harus Diisi'}),
    status: z.string({message: 'Status Keluarga Harus Diisi'}),
})

const socialStatusValidation = z.object({
    nama_status_sosial: z
        .string({message: 'Nama Sosial harus Diisi'}),
    status: z.string({message: 'Status Sosial harus Diisi'}),
})

const roomClassValidation = z.object({
    nama_kelas_kamar:z
        .string({message: 'Nama kelas Kamar harus Diisi'})
        .min(2,{message:'Nama Kelas Kamar Minimal 2 Karakter'})
        .max(10,{message: 'Nama Kelas Kamar Maximal 10 Karakter'}),
    status: z.string({message: 'Status Kamar harus Diisi'}),
    kode_bpjs_kamar:z.string({message: 'Kode bpjs_kamar harus Diisi'})
        .min(4,{ message: 'kode BPJS harus diisi minimal 4 karakter'})
        .max(10, {message: 'Kode BPJS Maximal 10 Karakter'}),
})

const roomTypeValidation = z.object({
    nama_jenis_kamar: z
        .string({ message: 'Nama jenis_kamar harus Diisi' })
        .min(2, { message: 'Nama jenis_kamar minimal 2 karakter' })
        .max(50, { message: 'Nama jenis_kamar maximal 50 karakter' }),
    status: z.string({ message: 'Status Kamar harus Diisi' }),
    id_kelas_kamar: z
        .number({ message: 'kelas kamar harus Diisi' }),
});

export {
    religionValidation,
    bloodTypeValidation,
    structuralPositionValidation,
    maritalStatusValidation,
    countryValidation,
    employeeStatusValidation,
    rankOrClassValidation,
    doctorSpecialistValidation,
    provinceValidation,
    regencyValidation,
    districtValidation,
    villageValidation,
    employeeTypeValidation,
    educationLeveValidation,
    familyStatusValidation,
    socialStatusValidation,
    roomClassValidation,
    roomTypeValidation
}
