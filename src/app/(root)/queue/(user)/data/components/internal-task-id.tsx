import useGet from '@/hooks/use-get';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InternalTaskId as InternalTaskIdType } from '@/types/task-id';
import { Badge } from '@/components/ui/badge';
import SkeletonTable from '@/components/ui/skeleton-table';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
interface InternalTaskIdProp {
    bookingCode: string | undefined;
}

const InternalTaskId = ({ bookingCode }: InternalTaskIdProp) => {
    const { data, loading, error } = useGet<InternalTaskIdType[]>({ url: `/bpjs/task-id/${bookingCode}/internal` });
    const formateDate = (date: Date) => {
        const instanceDate = new Date(date).toISOString();
        const [dateString, timeString] = instanceDate.split('T');
        return `${dateString} ${timeString.replace('.000Z', '')}`;
    };

    useEffect(() => {
        if (error) {
            toast({
                title: 'Terjadi Kesalahan',
                description: error.toString(),
            });
        }
    }, [error]);
    return (
        <div className="mt-8">
            {!loading && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">No</TableHead>
                            <TableHead className="text-center">Task Id</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Tanggal Kirim</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((internalTaskId: InternalTaskIdType, i: number) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell className="text-center">{i + 1}</TableCell>
                                    <TableCell className="font-semibold text-center">
                                        {internalTaskId?.kode_task_id}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {internalTaskId?.kode_response === 200 ? (
                                            <Badge className="bg-green-600">{internalTaskId?.kode_response}</Badge>
                                        ) : (
                                            <Badge className="bg-green-600">{internalTaskId?.kode_response}</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {formateDate(internalTaskId.tanggal_kirim)}
                                    </TableCell>
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

export default InternalTaskId;
