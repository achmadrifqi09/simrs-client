"use client"
import Image from "next/image";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {loginSchema} from "@/validation-schema/auth";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {signIn} from "next-auth/react";
import {LuEye, LuEyeOff} from "react-icons/lu";
import {LuLoader2} from "react-icons/lu";
import {useSearchParams} from "next/navigation";

const Login = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const searchParam = useSearchParams();
    const errorParam = searchParam.get('error')
    const credentials = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })

    const {handleSubmit, control} = credentials

    const onSubmit = handleSubmit(async (values) => {
        setLoadingSubmit(true);

        await signIn('credentials', {
            ...values
        })
    })

    return (
        <div className="h-dvh w-screen overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                <div
                    className="w-full h-dvh flex-col justify-center items-center hidden md:flex">
                    <div className="w-full flex flex-col items-center justify-center space-y-10">
                        <h2 className="text-primary text-center space-y-2 py-10 font-bold text-xl md:text-3xl xl:text-4xl">
                            <span className="block"> Selamat Datang di Vimedika!</span>
                        </h2>
                        <div className="w-full flex items-center justify-center">
                            <Image
                                src="/images/welcome-logo.png"
                                alt="Welcome Logo"
                                width={500}
                                height={500}
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-primary flex flex-col items-center justify-center px-6 relative">
                    <div className="max-w-[24em] w-full">
                        <div className="relative w-28 h-28 mb-8 md:hidden">
                            <Image
                                src="/images/logo-rs.png"
                                alt="Logo Vimedika" fill
                                sizes="(max-width: 28rem) 100vw, 28rem"
                            />
                        </div>
                        <h2 className="text-center leading-relaxed mb-3 text-2xl md:text-3xl text-white font-bold">
                            Sign In
                        </h2>
                        <p className="text-white text-center mb-8 font-medium">Masuk ke akun anda untuk melanjutkan</p>
                        <Form {...credentials}>
                            <form onSubmit={onSubmit} autoComplete="off">
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="username"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="text-white">Username</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" {...field}/>
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
                                                    <FormLabel className="text-white">Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type={showPassword ? "text" : "password"} {...field}/>
                                                            <button
                                                                onClick={() => setShowPassword((prev) => !prev)}
                                                                type="button"
                                                                className="absolute top-0.5 right-0.5 bottom-0.5 rounded-r bg-white px-3 text-gray-400">
                                                                {
                                                                    showPassword ? (<LuEye className="w-5 h-5"/>) : (
                                                                        <LuEyeOff className="w-5 h-5"/>)
                                                                }
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}/>
                                </div>
                                {errorParam && (<p className="text-primary text-sm">{errorParam}</p>)}
                                <div className="flex justify-end mt-10">
                                    <Button type="submit" disabled={loadingSubmit} className="w-full">
                                        {
                                            loadingSubmit ? (
                                                <>
                                                    <LuLoader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                    <span>Loading</span>
                                                </>
                                            ) : (
                                                <span>Login</span>
                                            )
                                        }
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
