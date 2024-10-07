import z from 'zod'

const religionValidation = z.object({
    nama_agama : z.string({message: 'Nama agama harus di isi'}).min(4, {message: 'Nama agama minimal 4 karakter'}),
    status : z.string({message: 'Status agama harus di isi'})
})

const bloodTypeValidation = z.object({
    nama_golongan_darah: z.string({message: 'Nama golongan darah harus di isi'})
        .min(1, {message: 'Nama golongan darah minimal 1 karakter'})
        .max(2,  {message: 'Nama golongan darah maksimal 2 karakter'}),
    status : z.string({message: 'Status golongan darah harus di isi'})
})

const structuralPositionValidation = z.object({
    nama_jabatan: z.string({message: 'Nama jabatan harus di isi'})
        .min(4, {message: 'Nama jabatan minimal 4 karakter'})
        .max(200,  {message: 'Nama jabatan maksimal 200 karakter'}),
    status : z.string({message: 'Status jabatan harus di isi'})
})

const maritalStatusValidation = z.object({
    nama_status_kawin: z.string({message: 'Nama status perkawinan harus di isi'})
        .min(4, {message: 'Nama status perkawinan minimal 4 karakter'})
        .max(50,  {message: 'Nama status perkawinan maksimal 50 karakter'}),
    status : z.string({message: 'Status harus di isi'})
})

export {
    religionValidation,
    bloodTypeValidation,
    structuralPositionValidation,
    maritalStatusValidation
}