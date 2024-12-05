"use client"

import React, {useState} from "react";
import {Control, useController} from "react-hook-form";
import {EmployeeForm} from "@/app/(root)/employee/form/form";
import Image from "next/image";
import {Label} from "@/components/ui/label";
import {FormField} from "@/components/ui/form";

interface PersonalDataProps {
    control: Control<EmployeeForm>;
}

const SupportingDocument = ({control}: PersonalDataProps) => {
    const {field: fotoField} = useController({
        name: "foto",
        control,
    });

    const {field: ktpField} = useController({
        name: "ktp",
        control,
    });

    const {field: kkField} = useController({
        name: "kk",
        control,
    });

    const {field: ktamField} = useController({
        name: "ktam",
        control,
    });

    const {field: npwpField} = useController({
        name: "npwp",
        control,
    });

    const [files, setFiles] = useState<(File | null)[]>([null, null, null, null, null]);
    const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([null, null, null, null, null]);

    const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = [...files];
        const selectedFile = event.target.files?.[0] || null;

        if (selectedFile) {
            const fileType = selectedFile.type;
            if (fileType !== "image/jpeg" && fileType !== "image/png" && fileType !== "image/jpg") {
                alert("Hanya file JPG, JPEG, dan PNG yang diperbolehkan!");
                newFiles[index] = null;
                setPreviewUrls((prev) => {
                    const newPreviewUrls = [...prev];
                    newPreviewUrls[index] = null;
                    return newPreviewUrls;
                });
            } else {
                newFiles[index] = selectedFile;

                // Ambil hanya nama file tanpa `C:\fakepath\`
                const cleanFileName = selectedFile.name;

                // Nama file unik untuk server atau tujuan lainnya
                const uniqueFileName = `foto-${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${cleanFileName}`;

                setPreviewUrls((prev) => {
                    const newPreviewUrls = [...prev];
                    newPreviewUrls[index] = URL.createObjectURL(selectedFile);
                    return newPreviewUrls;
                });

                switch (index) {
                    case 0:
                        ktpField.onChange(uniqueFileName);
                        break;
                    case 1:
                        kkField.onChange(uniqueFileName);
                        break;
                    case 2:
                        ktamField.onChange(uniqueFileName);
                        break;
                    case 3:
                        npwpField.onChange(uniqueFileName);
                        break;
                    case 4:
                        fotoField.onChange(uniqueFileName);
                        break;
                }
            }
        } else {
            setPreviewUrls((prev) => {
                const newPreviewUrls = [...prev];
                newPreviewUrls[index] = null;
                return newPreviewUrls;
            });
            newFiles[index] = null;
        }

        setFiles(newFiles);
    };


    return (
        <>
            <div className="ml-4">
                <div>
                    <div className="mb-4">
                        <Label>Foto Diri (JPG/PNG)</Label>
                        <div className="w-full h-auto border-2 border-dashed border-gray-300 p-4 rounded-md">
                            {previewUrls[4] ? (
                                <div className="max-w-md w-48 h-72 max-h-96 relative mx-auto">
                                    <Image
                                        src={previewUrls[4]}
                                        className="object-contain mx-auto mb-4"
                                        alt="Preview Foto"
                                        fill
                                    />
                                </div>
                            ) : (
                                <p className="text-center my-4">Tidak ada file yang dipilih</p>
                            )}

                            <FormField
                                control={control}
                                name="foto"
                                render={({field}) => (
                                    <>
                                        <input
                                            type="file"
                                            id="foto"
                                            accept="image/jpeg,image/png"
                                            onChange={(e) => {
                                                handleFileChange(4, e);
                                                field.onChange(e);
                                            }}
                                            hidden
                                        />
                                        <label
                                            htmlFor="foto"
                                            className="mt-6 px-4 py-2 bg-red-600 rounded-md w-max text-white mx-auto block cursor-pointer"
                                        >
                                            Pilih Foto Diri
                                        </label>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <Label>NPWP (JPG/PNG)</Label>
                        <div className="w-full h-auto border-2 border-dashed border-gray-300 p-4 rounded-md">
                            {previewUrls[3] ? (
                                <div className="max-w-md w-48 h-72 max-h-96 relative mx-auto">
                                    <Image
                                        src={previewUrls[3]}
                                        className="object-contain mx-auto mb-4"
                                        alt="Preview NPWP"
                                        fill
                                    />
                                </div>
                            ) : (
                                <p className="text-center my-4">Tidak ada file yang dipilih</p>
                            )}

                            <FormField
                                control={control}
                                name="npwp"
                                render={({field}) => (
                                    <>
                                        <input
                                            type="file"
                                            id="npwp"
                                            accept="image/jpeg,image/png"
                                            onChange={(e) => {
                                                handleFileChange(3, e);
                                                field.onChange(e);
                                            }}
                                            hidden
                                        />
                                        <label
                                            htmlFor="npwp"
                                            className="mt-6 px-4 py-2 bg-red-600 rounded-md w-max text-white mx-auto block cursor-pointer"
                                        >
                                            Pilih NPWP
                                        </label>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <Label>KTP (JPG/PNG)</Label>
                        <div className="w-full h-auto border-2 border-dashed border-gray-300 p-4 rounded-md">
                            {previewUrls[0] ? (
                                <div className="max-w-md w-48 h-72 max-h-96 relative mx-auto">
                                    <Image
                                        src={previewUrls[0]}
                                        className="object-contain mx-auto mb-4"
                                        alt="Preview KTP"
                                        fill
                                    />
                                </div>
                            ) : (
                                <p className="text-center my-4">Tidak ada file yang dipilih</p>
                            )}

                            <FormField
                                control={control}
                                name="ktp"
                                render={({field}) => (
                                    <>
                                        <input
                                            type="file"
                                            id="ktp"
                                            accept="image/jpeg,image/png"
                                            onChange={(e) => {
                                                handleFileChange(0, e);
                                                field.onChange(e);
                                            }}
                                            hidden
                                        />
                                        <label
                                            htmlFor="ktp"
                                            className="mt-6 px-4 py-2 bg-red-600 rounded-md w-max text-white mx-auto block cursor-pointer"
                                        >
                                            Pilih KTP
                                        </label>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <Label>KTAM (JPG/PNG)</Label>
                        <div className="w-full h-auto border-2 border-dashed border-gray-300 p-4 rounded-md">
                            {previewUrls[2] ? (
                                <div className="max-w-md w-48 h-72 max-h-96 relative mx-auto">
                                    <Image
                                        src={previewUrls[2]}
                                        className="object-contain mx-auto mb-4"
                                        alt="Preview KTAM"
                                        fill
                                    />
                                </div>
                            ) : (
                                <p className="text-center my-4">Tidak ada file yang dipilih</p>
                            )}

                            <FormField
                                control={control}
                                name="ktam"
                                render={({field}) => (
                                    <>
                                        <input
                                            type="file"
                                            id="ktam"
                                            accept="image/jpeg,image/png"
                                            onChange={(e) => {
                                                handleFileChange(2, e);
                                                field.onChange(e);
                                            }}
                                            hidden
                                        />
                                        <label
                                            htmlFor="ktam"
                                            className="mt-6 px-4 py-2 bg-red-600 rounded-md w-max text-white mx-auto block cursor-pointer"
                                        >
                                            Pilih KTAM
                                        </label>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <Label>KK (JPG/PNG)</Label>
                        <div className="w-full h-auto border-2 border-dashed border-gray-300 p-4 rounded-md">
                            {previewUrls[1] ? (
                                <div className="max-w-md w-48 h-72 max-h-96 relative mx-auto">
                                    <Image
                                        src={previewUrls[1]}
                                        className="object-contain mx-auto mb-4"
                                        alt="Preview KK"
                                        fill
                                    />
                                </div>
                            ) : (
                                <p className="text-center my-4">Tidak ada file yang dipilih</p>
                            )}

                            <FormField
                                control={control}
                                name="kk"
                                render={({field}) => (
                                    <>
                                        <input
                                            type="file"
                                            id="kk"
                                            accept="image/jpeg,image/png"
                                            onChange={(e) => {
                                                handleFileChange(1, e);
                                                field.onChange(e);
                                            }}
                                            hidden
                                        />
                                        <label
                                            htmlFor="kk"
                                            className="mt-6 px-4 py-2 bg-red-600 rounded-md w-max text-white mx-auto block cursor-pointer"
                                        >
                                            Pilih KK
                                        </label>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SupportingDocument;
