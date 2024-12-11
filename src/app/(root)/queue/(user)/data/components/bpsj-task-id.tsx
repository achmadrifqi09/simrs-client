import useGet from '@/hooks/use-get';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BPJSTaskId as BPJSTaskIdType } from '@/types/task-id';
import SkeletonTable from '@/components/ui/skeleton-table';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
interface InternalTaskIdProp {
    bookingCode: string | undefined;
}

const BPJSTaskId = ({ bookingCode }: InternalTaskIdProp) => {
    const { data, loading, error } = useGet<BPJSTaskIdType[]>({ url: `/bpjs/task-id/${bookingCode}` });

    useEffect(() => {
        if (error) {
            toast({
                title: 'Terjadi Kesalahan',
                description: error.toString(),
            });
        }
    }, []);
    return (
        <div className="mt-8">
            {!loading && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">No</TableHead>
                            <TableHead className="text-center">Task Id</TableHead>
                            <TableHead className="text-center">Nama Task</TableHead>
                            <TableHead className="text-center">Tanggal Kirim</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((bpjsTaskId: BPJSTaskIdType, i: number) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell className="text-center">{i + 1}</TableCell>
                                    <TableCell className="font-semibold text-center">{bpjsTaskId?.taskid}</TableCell>
                                    <TableCell className="text-center">{bpjsTaskId?.taskname}</TableCell>
                                    <TableCell className="text-center">{bpjsTaskId.waktu}</TableCell>
                                </TableRow>
                            );
                        })}
                        {data?.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={4}>
                                    Data task id tidak tidak ditemukan
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
            {loading && <SkeletonTable />}
        </div>
    );
};

export default BPJSTaskId;
