import React from 'react';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdmissionQueue } from '@/types/admission-queue';
import InternalTaskId from './internal-task-id';
import BPJSTaskId from './bpsj-task-id';

interface DrawerTaskIdProps {
    showTaskId: boolean;
    setShowTaskId: React.Dispatch<React.SetStateAction<boolean>>;
    selectedQueue: AdmissionQueue;
    setSelectedQueue: React.Dispatch<React.SetStateAction<AdmissionQueue | null>>;
}

const DrawerTaskId = ({ showTaskId, setShowTaskId, selectedQueue, setSelectedQueue }: DrawerTaskIdProps) => {
    return (
        <Drawer
            open={showTaskId}
            onOpenChange={() => {
                setShowTaskId(false);
                setSelectedQueue(null);
            }}
        >
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                        <div className="max-w-screen-xl xl:max-w-screen-2xl mx-auto w-full text-xl flex justify-between">
                            <h4>Logs Task ID</h4>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-600"
                                onClick={() => {
                                    setShowTaskId(false);
                                    setSelectedQueue(null);
                                }}
                            >
                                <XIcon />
                            </Button>
                        </div>
                    </DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <div className="h-[72dvh] overflow-y-scroll max-sm:pb-6 max-w-screen-xl xl:max-w-screen-2xl mx-auto w-full px-4 2xl:px-0">
                    <div className="mb-6 bg-gray-50 px-3 py-4 rounded-md">
                        <p className="mb-2">Detail Pasien</p>
                        <div className="max-md:grid grid-cols-1 sm:grid-cols-2 md:flex lg:flex-wrap gap-4 md:gap-6 lg:gap-8 items-center">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Nama pasien</p>
                                <p className="text-sm">{selectedQueue.nama_pasien}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Nomor BPJS</p>
                                <p className="text-sm">{selectedQueue.no_bpjs || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Nomor Rujukan</p>
                                <p className="text-sm">{selectedQueue.no_rujukan || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Kode Booking</p>
                                <p className="text-sm">{selectedQueue?.pendaftaran?.kode_booking || '-'}</p>
                            </div>
                        </div>
                    </div>
                    <Tabs defaultValue="internal">
                        <TabsList className="mb-2">
                            <TabsTrigger value="internal">Task ID Internal</TabsTrigger>
                            <TabsTrigger value="bpjs">Task ID BPJS</TabsTrigger>
                        </TabsList>
                        <TabsContent value="internal" className="px-2">
                            <p className="font-medium">Daftar Task ID internal RS</p>
                            <InternalTaskId bookingCode={selectedQueue.pendaftaran.kode_booking} />
                        </TabsContent>
                        <TabsContent value="bpjs" className="px-2">
                            <p className="font-medium"> Daftar Task ID BPJS</p>
                            <BPJSTaskId bookingCode={selectedQueue?.pendaftaran?.kode_booking} />
                        </TabsContent>
                    </Tabs>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default DrawerTaskId;
