import {ReactNode} from "react";
import Link from "next/link";

type SolidCardProps = {
    children: ReactNode,
    href: string,
}

const SolidCard = ({children, href = '#'}: SolidCardProps) => {
    return (
        <Link href={href} className="after:bg-circles after:w-[26em] after:h-[26em] after:-top-[14em] after:bg-center
            after:-left-32 after:bg-cover overflow-hidden after:absolute after:z-0 relative h-max p-6 rounded-lg
            bg-gradient-to-br from-red-600 to-orange-600 text-white flex justify-center items-center hover:from-red-600/90
            hover:shadow hover:to-orange-600 min-w-[20em]">
            <div className="relative z-10">{children}</div>
        </Link>
    )
}

export default SolidCard