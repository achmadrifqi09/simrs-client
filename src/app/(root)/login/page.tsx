"use client"
import Image from "next/image";
import Heading from "@/components/ui/heading";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Footer from "@/components/ui/footer";
import {Eye, EyeOff, FolderLock} from "lucide-react";
import React, {useState} from "react";
import {loginSchema} from "@/validation-schema/auth";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

const Login = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const route = useRouter();
    const {status} = useSession()
    const credentials = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const {handleSubmit, control} = credentials

    const onSubmit = handleSubmit(async (values) => {
        setErrorMessage(null);
        const result = await signIn('credentials', {
            redirect: false,
            ...values
        })
        console.log(result)
        if (result?.error) {
            setErrorMessage(result.error)
            return
        }
        route.push('/')
    })

    if (status === 'authenticated') {
        route.back()
    }

    if (status === 'unauthenticated') {
        return (
            <div className="h-dvh w-screen overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    <div
                        className="w-full h-dvh bg-gradient-to-br from-red-600 to-orange-600 flex-col justify-center items-center hidden md:flex">
                        <div className="w-full h-full flex flex-col items-center justify-center px-6">
                            <div className="relative w-40 h-40 mb-6">
                                <Image
                                    src="/images/logo-rs-white.png"
                                    alt="Logo RSU UMM"
                                    fill
                                    sizes="(max-width: 28rem) 100vw, 28rem"
                                />
                            </div>
                            <Heading headingLevel="h2"
                                     className="text-white text-center space-y-2 leading-relaxed font-bold">
                                <span className="block"> Rumah Sakit Umum</span>
                                <span className="block">Universitas Muhammadiyah Malang</span>
                            </Heading>
                            <p className="text-lg text-red-50">Layananku Pengabdianku</p>
                        </div>
                        <div className="w-full h-full bg-login-banner bg-contain bg-no-repeat bg-bottom">
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center px-6 relative">
                        <div className="max-w-[24em] w-full">
                            <div className="relative w-28 h-28 mb-8 md:hidden">
                                <Image
                                    src="/images/logo-rs.png"
                                    alt="Logo RSU UMM" fill
                                    sizes="(max-width: 28rem) 100vw, 28rem"
                                />
                            </div>
                            <div
                                className=" rounded-full md:flex bg-[#074570] hidden items-center justify-center w-max p-4 text-white mb-8">
                                <FolderLock/>
                            </div>
                            <p className="text-gray-500">Selamat datang</p>
                            <Heading headingLevel="h3" variant="page-title"
                                     className="text-left space-y-2 leading-relaxed mb-6">
                                Portal Sistem Manajemen<br/>Rumah Sakit
                            </Heading>
                            <Form {...credentials}>
                                <form onSubmit={onSubmit}>
                                    <div className="my-4">
                                        <FormField
                                            control={control}
                                            name="email"
                                            render={({field}) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input type="email" {...field}/>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )
                                            }}/>

                                    </div>
                                    <div className="my-4">
                                        <FormField
                                            control={control}
                                            name="password"
                                            render={({field}) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Password</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    type={showPassword ? "text" : "password"} {...field}/>
                                                                <button
                                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                                    type="button"
                                                                    className="absolute top-0.5 right-0.5 bottom-0.5 rounded-r bg-white px-3 text-gray-400">
                                                                    {
                                                                        showPassword ? (<Eye className="w-5 h-5"/>) : (
                                                                            <EyeOff className="w-5 h-5"/>)
                                                                    }
                                                                </button>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )
                                            }}/>
                                    </div>
                                    {errorMessage && (<p className="text-red-700 text-sm">{errorMessage}</p>)}
                                    <div className="flex justify-end mt-10">
                                        <Button>
                                            Login
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                        <div className="absolute bottom-0 right-0 left-0">
                            <Footer/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login