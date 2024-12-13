'use client';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ZodError } from 'zod';

interface AlertErrorProps {
    redirectUrl?: string | null;
    message: any;
    isShow: boolean;
}

const AlertError = ({ redirectUrl, message: formError, isShow = false }: AlertErrorProps) => {
    const [show, setShow] = useState<boolean>(isShow);
    const router = useRouter();
    const handleActionError = () => {
        if (redirectUrl) {
            router.push(redirectUrl);
        }
        setShow(false);
    };

    return (
        <AlertDialog open={show} onOpenChange={handleActionError}>
            <AlertDialogTrigger asChild></AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Terjadi Kesalahan</AlertDialogTitle>
                    <AlertDialogDescription className="text-base"></AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    {formError && (Array.isArray(formError) || Array.isArray(formError?.errors))
                        ? formError.errors
                            ? formError.errors.map((error: ZodError, index: number) => (
                                  <p className="text-sm text-red-600" key={index}>
                                      {error.message}
                                  </p>
                              ))
                            : formError.map((error: ZodError, index: number) => (
                                  <p className="text-sm text-red-600" key={index}>
                                      {error.message}
                                  </p>
                              ))
                        : formError && <p className="text-sm text-red-600">{formError.toString()}</p>}
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleActionError}>Oke</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AlertError;
