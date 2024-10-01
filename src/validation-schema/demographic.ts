import z from 'zod'

const religionSchema = z.object({
    nama_agama : z.string({message: 'Nama agama harus di isi'}).min(4, {message: 'Nama agama minimal 4 karakter'}),
    status : z.string({message: 'Status agama harus di isi'})
})
export {religionSchema}