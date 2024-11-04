"use client"

import React, {useState} from "react";
import {Control} from "react-hook-form";
import {EmployeeForm} from "@/app/(root)/employee/form/form";
import Image from "next/image";
import { Label } from "@/components/ui/label";

interface PersonalDataProps {
    control: Control<EmployeeForm>;
}

const SupportingDocument = ({
                           control
                       }: PersonalDataProps
) => {
    const [files, setFiles] = useState<(File | null)[]>([null, null, null, null, null]);
    const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([null, null, null, null, null]);

    const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = [...files];
        const selectedFile = event.target.files?.[0] || null;
        setFiles(newFiles);
        if (selectedFile) {
            const fileType = selectedFile.type;
            if (fileType !== 'image/jpeg' && fileType !== 'image/png' && fileType !== 'image/jpg') {
                alert('Hanya file JPG, JPEG, dan PNG yang diperbolehkan!'); // Alert untuk kesalahan
                newFiles[index] = null; // Reset file jika tidak valid
                setPreviewUrls((prev) => {
                    const newPreviewUrls = [...prev];
                    newPreviewUrls[index] = null; // Reset preview jika file tidak valid
                    return newPreviewUrls;
                });
            } else {
                newFiles[index] = selectedFile;
                const newPreviewUrls = [...previewUrls];
                newPreviewUrls[index] = URL.createObjectURL(selectedFile);
                setPreviewUrls(newPreviewUrls);
            }
        } else {
            // Reset preview jika tidak ada file yang dipilih
            const newPreviewUrls = [...previewUrls];
            newPreviewUrls[index] = null;
            setPreviewUrls(newPreviewUrls);
            newFiles[index] = null; // Reset file
        }

        setFiles(newFiles);
    };
    return (
        <>
        <div className="ml-4">
            <div>
                <div className="mb-4">
                    <Label>Foto Diri (JPG/PNG)</Label>
                    <div
                        className="w-full h-auto border-2 border-dashed border-gray-300 p-4 rounded-md">
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
                        <label htmlFor="diri"
                               className="mt-6 px-4 py-2 bg-red-600 rounded-md w-max text-white mx-auto block">
                            Pilih Foto Diri
                        </label>
                        <input
                            type="file"
                            id="diri"
                            accept="image/jpeg,image/png"
                            onChange={(e) => handleFileChange(4, e)}
                            hidden
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <Label>KTP (JPG/PNG)</Label>
                    <div
                        className="w-full h-auto border-2 border-dashed border-gray-300 p-4 rounded-md">
                        {previewUrls[0] ? (
                            <div className="w-full max-w-md aspect-w-4 aspect-h-3 mx-auto">
                                <Image
                                    src={previewUrls[0]}
                                    className="w-full h-auto max-h-96 object-contain mx-auto mb-4"
                                    alt="Preview KTP"
                                />
                            </div>
                        ) : (
                            <p className="text-center my-4">Tidak ada file yang dipilih</p>
                        )}
                        <label htmlFor="ktp"
                               className=" px-4 py-2 bg-red-600 rounded-md w-max text-white mx-auto block">
                            Pilih Foto KTP
                        </label>
                        <input
                            type="file"
                            id="ktp"
                            accept="image/jpeg,image/png"
                            onChange={(e) => handleFileChange(0, e)}
                            hidden
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <Label>KK (JPG/PNG)</Label>
                    <div
                        className="w-full h-auto border-2 border-dashed border-gray-300 p-4 rounded-md">
                        {previewUrls[1] ? (
                            <div className="w-full max-w-md mx-auto">
                                <Image
                                    src={previewUrls[1]}
                                    className="w-full h-auto max-h-96 object-contain mx-auto mb-4"
                                    alt="Preview KK"
                                />
                            </div>
                        ) : (
                            <p className="text-center my-4">Tidak ada file yang dipilih</p>
                        )}
                        <label htmlFor="kk"
                               className=" px-4 py-2 bg-red-600 rounded-md w-max text-white mx-auto block">
                            Pilih Foto KK
                        </label>
                        <input
                            type="file"
                            id="kk"
                            accept="image/jpeg,image/png"
                            onChange={(e) => handleFileChange(1, e)}
                            hidden
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <Label>KTAM (JPG/PNG)*</Label>
                    <div
                        className="w-full h-auto border-2 border-dashed border-gray-300 p-4 rounded-md">
                        {previewUrls[2] ? (
                            <div className="w-full max-w-md aspect-w-4 aspect-h-3 mx-auto">
                                <Image
                                    src={previewUrls[2]}
                                    className="w-full h-auto max-h-96 object-contain mx-auto mb-4"
                                    alt="Preview KTAM"
                                />
                            </div>
                        ) : (
                            <p className="text-center my-4">Tidak ada file yang dipilih</p>
                        )}
                        <label htmlFor="ktam"
                               className=" px-4 py-2 bg-red-600 rounded-md w-max text-white mx-auto block">
                            Pilih Foto KTAM
                        </label>
                        <input
                            type="file"
                            id="ktam"
                            accept="image/jpeg,image/png"
                            onChange={(e) => handleFileChange(2, e)}
                            hidden
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <Label>NPWP (JPG/PNG)</Label>
                    <div
                        className="w-full h-auto border-2 border-dashed border-gray-300 p-4 rounded-md">
                        {previewUrls[3] ? (
                            <div className="w-full max-w-md aspect-w-4 aspect-h-3 mx-auto">
                                <Image
                                    src={previewUrls[3]}
                                    className="w-full h-auto max-h-96 object-contain mx-auto mb-4"
                                    alt="Preview NPWP"
                                />
                            </div>
                        ) : (
                            <p className="text-center my-4">Tidak ada file yang dipilih</p>
                        )}
                        <label htmlFor="npwp"
                               className=" px-4 py-2 bg-red-600 rounded-md w-max text-white mx-auto block">
                            Pilih Foto NPWP
                        </label>
                        <input
                            type="file"
                            id="npwp"
                            accept="image/jpeg,image/png"
                            onChange={(e) => handleFileChange(3, e)}
                            hidden
                        />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default SupportingDocument
