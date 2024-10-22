"use server"
import axios, {isAxiosError} from 'axios';
import {encryptData, generateSignature} from "@/lib/crypto-js/cipher";
import {loginSchema} from "@/validation-schema/auth";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export async function authenticate(_currentState: unknown, formData: FormData) {
    const validatedFields = loginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    const errorMessage = {message: 'Kredensial login tidak valid.'};

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
            JSON.stringify({
                email: validatedFields.data.email,
                password: validatedFields.data.password,
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'client-signature': generateSignature(),
                    'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
                },
            }
        );

        if (response.status !== 200 || !response.data?.data) {
            return errorMessage
        }

        await createSession(response.data.data);
        redirect('/')
    } catch (error) {
        if (isAxiosError(error)) {
            return error?.response?.data?.errors || error?.message || 'Terjadi kesalahan yang tidak terduga'
        } else {
            return 'Terjadi kesalahan yang tidak terduga'
        }
    }
}


const createSession = async (data: any) => {
    const sessionData = encryptData(
        JSON.stringify({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
            },
            accessToken: data.token,
            expires: data.expires,
        })
    );

    if (sessionData) {
        cookies().set('session', sessionData, {
            httpOnly: true,
            secure: true,
            expires: new Date(data.expires),
            sameSite: 'lax',
            path: '/',
        })
    }
}
