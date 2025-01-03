import {ReactNode} from "react";
import Link from "next/link";
import {cn} from "@/lib/utils";

type SolidCardProps = {
    children: ReactNode;
    href?: string;
    type?: string;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
}
export const solidCardBaseClass: string = `
         after:bg-circles after:w-[21.4em] after:h-[21.4em] after:-top-[13em] after:rotate-45 after:bg-center
         after:-left-[13em] after:bg-cover overflow-hidden after:absolute after:z-0 relative h-max p-6 rounded-lg
         bg-gradient-to-br from-red-600 to-red-500 text-white flex justify-center items-center hover:from-red-600/90
         hover:shadow hover:to-red-500 relative h-full`;

const SolidCard = ({children, onClick, href = '#', type = 'link', disabled = false, className}: SolidCardProps) => {


    return (
        <>
            {
                type === 'button' ? (
                    <button
                        onClick={onClick}
                        disabled={disabled}
                        className={cn(solidCardBaseClass, (disabled ? 'opacity-80 cursor-not-allowed' : 'opacity-100'), className)}>
                        <div className="relative z-10">{children}</div>
                    </button>
                ) : (
                    <Link href={href} className={cn(solidCardBaseClass, className)}>
                        <div className="relative z-10">{children}</div>
                    </Link>
                )
            }
        </>
    )
}

export default SolidCard