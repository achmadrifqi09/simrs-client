import {ReactNode} from "react";
import Link from "next/link";

type SolidCardProps = {
    children: ReactNode,
    href: string,
}

const SolidCard = ({children, href = '#'}: SolidCardProps) => {
    return (
        <Link href={href} className="after:bg-circles after:w-[21.4em] after:h-[21.4em] after:-top-[12em] after:rotate-45 after:bg-center
            after:-left-[9em] after:bg-cover overflow-hidden after:absolute after:z-0 relative h-max p-6 rounded-lg
            bg-gradient-to-br from-red-600 to-orange-600 text-white flex justify-center items-center hover:from-red-600/90
            hover:shadow hover:to-orange-600">
            <div className="relative z-10">{children}</div>
        </Link>
    )
}

export default SolidCard