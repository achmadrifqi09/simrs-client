import React, { forwardRef, useRef } from "react";
import { RegisterResponse } from "@/types/queue-register";
import {formatToStandardDate, timeStringFormatter} from "@/utils/time-formatter";

interface QueueTicketProps {
    data: RegisterResponse;
}

const QueueTicket = forwardRef<HTMLDivElement, QueueTicketProps>((props, ref) => {
    const { data } = props;
    const ticketRef = useRef<HTMLDivElement>(null);
    const combinedRef = ref || ticketRef;

    return (
        <div ref={combinedRef}>
            <p className="title">Faskes Tingkat Lanjut</p>
            <p className="title">RSU Universitas Muhammadiyah Malang</p>
            <p>{formatToStandardDate(data.created_at.split('T')[0])} {timeStringFormatter(data.created_at)}</p>
            <p>{data.nama_pasien}</p>
            <hr/>
            <div className="content">
                <p className="bold">Harap check-in 30 menit sebelum praktik</p>
                <p className="queue-number">{data.kode_antrian}-{data.no_antrian}</p>
                <p className="bold">Admisi/TPP</p>
            </div>
            <hr/>
            <p>Sisa antrean: {data.sisa_antrian_onsite}</p>
            <p className="unit">{data.poliklinik} - {data.dokter}</p>
            <small className="notes">
                *) Kode A/C akan dipanggil pada jam 07:00 - selesai.
            </small>
            <br/>
            <small className="notes">
                *) Kode B/D akan dipanggil pada jam 12:00 - selesai.
            </small>
        </div>
    );
});

QueueTicket.displayName = "QueueTicket";

export default QueueTicket;
