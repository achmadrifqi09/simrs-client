import { Input } from '@/components/ui/input';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { usePost } from '@/hooks/use-post';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationFeeValidation } from '@/validation-schema/registration-fee';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import React, { SetStateAction, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface RegistrationFeeProps {
    id: number;
    onRefresh: () => void;
    setIsRegistrationFee: React.Dispatch<SetStateAction<boolean>>;
}

const RegistrationFee = ({ id, onRefresh }: RegistrationFeeProps) => {
    const registrationFeeForm = useForm<z.infer<typeof registrationFeeValidation>>({
        resolver: zodResolver(registrationFeeValidation),
        defaultValues: {
            diskon_daftar: '0',
            diskon_dokter: '0',
            diskon_kartu: '0',
            biaya_kartu: '',
            biaya_daftar: '',
            biaya_dokter: '',
        },
    });

    const { handleSubmit, control } = registrationFeeForm;
    const { postData, postLoading, postError } = usePost('/registration-fee');
    const onSubmit = handleSubmit(async (values) => {
        const response = await postData({
            id_pendaftaran: Number(id),
            ...values,
        });
        if (response?.status_code == 201) {
            onRefresh();
            toast({
                description: 'Berhasil menambahakan biaya',
            });
        }
    });
    useEffect(() => {
        if (postError) {
            toast({
                title: 'Terjadi Kesalahan',
                description: postError.toString(),
            });
        }
    }, [postError]);
    return (
        <div className="my-6">
            <Heading headingLevel="h6">Formulir Biaya</Heading>
            <Form {...registrationFeeForm}>
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
                        <FormField
                            control={control}
                            name="biaya_daftar"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Biaya Pendaftaran*</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={control}
                            name="diskon_daftar"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Diskon Pendaftaran</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="number" {...field} />
                                                <div className="absolute top-0.5 px-4 font-medium text-base right-0.5 bg-white h-9 flex justify-center items-center rounded-r-md">
                                                    <span>%</span>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
                        <FormField
                            control={control}
                            name="biaya_kartu"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Biaya Kartu</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={control}
                            name="diskon_kartu"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Biaya Kartu</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="number" {...field} />
                                                <div className="absolute top-0.5 px-4 font-medium text-base right-0.5 bg-white h-9 flex justify-center items-center rounded-r-md">
                                                    <span>%</span>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
                        <FormField
                            control={control}
                            name="biaya_dokter"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Biaya Dokter*</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={control}
                            name="diskon_dokter"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Diskon Dokter</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="number" {...field} />
                                                <div className="absolute top-0.5 px-4 font-medium text-base right-0.5 bg-white h-9 flex justify-center items-center rounded-r-md">
                                                    <span>%</span>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={postLoading}>
                            {postLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span>Loading</span>
                                </>
                            ) : (
                                <span>Simpan</span>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default RegistrationFee;
