import { PatientType } from '@/types/patient';
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Registration } from '@/types/register';
import FormSEP from './form-sep';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

interface SEPDialogProps {
    patient: PatientType | null;
    registration: Registration | null;
    openDialogSEP: boolean;
    setOpenDialogSEP: React.Dispatch<React.SetStateAction<boolean>>;
    onRefresh: () => void;
}

const SEPDialog = ({ patient, registration, openDialogSEP, setOpenDialogSEP, onRefresh }: SEPDialogProps) => {
    return (
        <>
            <div>
                <Button onClick={() => setOpenDialogSEP((prev) => !prev)}>Insert SEP</Button>
                {openDialogSEP && (
                    <div className="fixed inset-0 z-50">
                        <div
                            className="bg-gray-950 opacity-70 fixed inset-0 z-0"
                            onClick={() => setOpenDialogSEP(false)}
                        ></div>
                        <div className="fixed left-6 right-6 max-w-screen-2xl mx-auto top-6 bottom-6 pb-6 rounded-lg z-50 px-6 bg-white shadow-lg">
                            <div className="sticky top-0 bg-white z-10 pb-4">
                                <div className="flex pt-4 px-2 justify-between">
                                    <Heading variant="section-title" headingLevel="h4">
                                        Formulir Insert SEP
                                    </Heading>
                                    <Button size="icon" variant="ghost" onClick={() => setOpenDialogSEP(false)}>
                                        <X className="w-5 h-5 text-gray-500" />
                                    </Button>
                                </div>
                                <Separator />
                            </div>
                            <div className="h-[calc(100dvh_-_48px_-_98px)] pb-4 rounded-lg overflow-auto custom-scroll z-10">
                                <FormSEP
                                    registration={registration}
                                    patient={patient}
                                    setOpenSEPDialog={setOpenDialogSEP}
                                    onRefresh={onRefresh}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SEPDialog;
