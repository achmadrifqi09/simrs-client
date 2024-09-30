import {z} from 'zod';

const loginSchema = z.object({
    email: z.string().email({message: 'Email tidak valid'}),
    password: z.string().min(8, {message: 'Password minimal 8 karakter'})
})

export {loginSchema};