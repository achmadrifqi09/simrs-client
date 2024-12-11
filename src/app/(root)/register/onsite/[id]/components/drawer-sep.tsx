/*
{
              "t_sep":{
                 "noKartu":"0001105689835",
                 "tglSep":"2021-07-30",
                 "ppkPelayanan":"0301R011",
                 "jnsPelayanan":"1",
                 "klsRawat":{
                    "klsRawatHak":"2",
                    "klsRawatNaik":"1",
                    "pembiayaan":"1",
                    "penanggungJawab":"Pribadi"
                 },
                 "noMR":"MR9835",
                 "rujukan":{
                    "asalRujukan":"2",
                    "tglRujukan":"2021-07-23",
                    "noRujukan":"RJKMR9835001",
                    "ppkRujukan":"0301R011"
                 },
                 "catatan":"testinsert RI",
                 "diagAwal":"E10",
                 "poli":{
                    "tujuan":"",
                    "eksekutif":"0"
                 },
                 "cob":{
                    "cob":"0"
                 },
                 "katarak":{
                    "katarak":"0"
                 },
                 "jaminan":{
                    "lakaLantas":"0",
                    "noLP":"12345",
                    "penjamin":{
                       "tglKejadian":"",
                       "keterangan":"",
                       "suplesi":{
                          "suplesi":"0",
                          "noSepSuplesi":"",
                          "lokasiLaka":{
                             "kdPropinsi":"",
                             "kdKabupaten":"",
                             "kdKecamatan":""
                          }
                       }
                    }
                 },
                 "tujuanKunj":"0",
                 "flagProcedure":"",
                 "kdPenunjang":"",
                 "assesmentPel":"",
                 "skdp":{
                    "noSurat":"0301R0110721K000021",
                    "kodeDPJP":"31574"
                 },
                 "dpjpLayan":"",
                 "noTelp":"081111111101",
                 "user":"Coba Ws"
              }
           }
*/

import { PatientType } from '@/types/patient';
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

interface DrawerSEPProps {
    patient: PatientType | null;
    openDrawerSEP: boolean;
    setOpenDrawerSEP: React.Dispatch<React.SetStateAction<boolean>>;
}
const DrawerSEP = ({ openDrawerSEP, setOpenDrawerSEP }: DrawerSEPProps) => {
    return (
        <>
            <Drawer open={openDrawerSEP} onOpenChange={setOpenDrawerSEP}>
                <DrawerTrigger>Open</DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            <div className="max-w-screen-xl xl:max-w-screen-2xl mx-auto w-full text-xl flex justify-between">
                                <h4>Formulir Cetak SEP</h4>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-600"
                                    onClick={() => {
                                        setOpenDrawerSEP(false);
                                    }}
                                >
                                    <XIcon />
                                </Button>
                            </div>
                        </DrawerTitle>
                        <div className="h-[72dvh] max-w-screen-xl xl:max-w-screen-2xl mx-auto w-full px-4 2xl:px-0"></div>
                    </DrawerHeader>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default DrawerSEP;
