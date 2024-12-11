"use client";

import React, { useState, useEffect } from "react";
import { Control, useController } from "react-hook-form";
import { EmployeeForm } from "@/app/(root)/employee/form/form";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface PersonalDataProps {
    control: Control<EmployeeForm>;
    setFiles: React.Dispatch<React.SetStateAction<(File | null)[]>>;
    initialFiles?: (string | File | null | undefined)[];
}

const SupportingDocument = ({
                                control,
                                setFiles,
                                initialFiles = [null, null, null, null, null] as (string | File | null)[]
                            }: PersonalDataProps) => {
    const fields = [
        useController({ name: "ktp", control }).field,
        useController({ name: "kk", control }).field,
        useController({ name: "ktam", control }).field,
        useController({ name: "npwp", control }).field,
        useController({ name: "foto", control }).field,
    ];

    const [previewUrls, setPreviewUrls] = useState<(string | null)[]>(
        (initialFiles || []).map(file => file ? `/uploads/${file}` : null)
    );

    useEffect(() => {
        return () => {
            previewUrls.forEach(url => {
                if (url && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, []);

    const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        if (selectedFile) {
            const allowedTypes = ["image/jpeg", "image/png"];
            if (!allowedTypes.includes(selectedFile.type)) {
                alert("Hanya file JPG, JPEG, dan PNG yang diperbolehkan!");
                return;
            }

            const maxFileSize = 5 * 1024 * 1024;
            if (selectedFile.size > maxFileSize) {
                alert("Ukuran file tidak boleh lebih dari 5MB!");
                return;
            }

            setFiles((prevFiles) => {
                const updatedFiles = [...prevFiles];
                updatedFiles[index] = selectedFile
                return updatedFiles;
            });

            setPreviewUrls((prev) => {
                const newPreviewUrls = [...prev];
                newPreviewUrls[index] = URL.createObjectURL(selectedFile);
                return newPreviewUrls;
            });

            fields[index].onChange(selectedFile.name);
        }
    };



    const handleFileRemove = (index: number) => {
        if (previewUrls[index] && previewUrls[index]?.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrls[index]!);
        }

        setFiles((prevFiles) => {
            const updatedFiles = [...prevFiles];
            updatedFiles[index] = null;
            return updatedFiles;
        });

        setPreviewUrls((prev) => {
            const newPreviewUrls = [...prev];
            newPreviewUrls[index] = null;
            return newPreviewUrls;
        });

        fields[index].onChange(null);
    };

    const labels = ["KTP", "KK", "KTAM", "NPWP", "Foto Diri"];

    return (
        <div className="ml-4">
            {labels.map((label, index) => (
                <div key={index} className="mb-4">
                    <Label>{label} (JPG/PNG)</Label>
                    <div className="w-full h-auto border-2 border-dashed border-gray-300 p-4 rounded-md relative">
                        {previewUrls[index] ? (
                            <div className="max-w-md w-48 h-72 max-h-96 relative mx-auto">
                                <Image
                                    src={previewUrls[index]!}
                                    className="object-contain mx-auto mb-4"
                                    alt={`Preview ${label}`}
                                    fill
                                />
                                <button
                                    type="button"
                                    onClick={() => handleFileRemove(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-2"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <p className="text-center my-4">Tidak ada file yang dipilih</p>
                        )}
                        <input
                            type="file"
                            id={`file-${index}`}
                            accept="image/jpeg,image/png"
                            onChange={(e) => handleFileChange(index, e)}
                            hidden
                        />
                        <label
                            htmlFor={`file-${index}`}
                            className="mt-6 px-4 py-2 bg-red-600 rounded-md w-max text-white mx-auto block cursor-pointer"
                        >
                            Pilih {label}
                        </label>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SupportingDocument;
