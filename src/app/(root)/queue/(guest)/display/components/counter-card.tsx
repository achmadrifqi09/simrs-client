import {CounterDisplayWS} from "@/types/admission-queue";

type CounterCardProps = {
    data: CounterDisplayWS
}
const CounterCard = ({data} : CounterCardProps) => {
    return (
        <div
            className="w-full flex flex-col h-auto shadow-md
            bg-gradient-to-br from-red-600 to-red-500 text-white rounded-xl p-2.5">
           <div className="h-10 flex justify-center items-center">
               <h4 className="text-xl text-center font-medium">{data.nama_loket}</h4>
           </div>
            <div className="relative flex-1 h-full bg-white rounded-lg text-gray-900 flex justify-center items-center py-4 md:py-6 xl:py-16 2xl:py-24 shadow-lg">
              <h1 className="text-2xl lg:text-4xl xl:text-6xl 2xl:text-7xl font-bold">
                  {data.antrian.length !== 0 ? `${data.antrian[0].kode_antrian}-${data.antrian[0].no_antrian}` : '-'}
              </h1>
            </div>
        </div>
    )
}

export default CounterCard;