"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {ZodError} from "zod";

interface AlertErrorProps {
    redirectUrl?: string | null;
    message: any;
    isShow: boolean
}

const AlertError = ({redirectUrl, message, isShow = false}: AlertErrorProps) => {
    const [show, setShow] = useState<boolean>(isShow);
    const router = useRouter();
    const handleActionError = () => {
        if (redirectUrl) {
            router.push(redirectUrl)
        }
        setShow(false);
    }

    return (
        <AlertDialog open={show} onOpenChange={handleActionError}>
            <AlertDialogTrigger asChild></AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Terjadi Kesalahan</AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                        {message && Array.isArray(message) ? (
                            <div>
                                {message.map((error: ZodError, index: number) => (
                                    <p className="text-sm text-red-600" key={index}>{error.message}</p>
                                ))}
                            </div>
                        ) : (
                            message && (
                               message
                            )
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleActionError}>Oke</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertError;