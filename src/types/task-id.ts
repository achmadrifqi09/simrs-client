export type InternalTaskId = {
    id: number;
    kode_task_id: number;
    kode_response: number;
    tanggal_kirim: Date;
    kode_booking: string;
};

export type BPJSTaskId = {
    wakturs: string;
    waktu: string;
    taskname: string;
    taskid: number;
    kodebooking: string;
};
