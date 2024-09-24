"use client"
import {Button} from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import {useParams} from "next/navigation";
import {useEffect} from "react";

type RegisterParams = {
    code: string,
    practice_hours:string
}

const Register = () => {
    const params = useParams<RegisterParams>();
    const handleBackButton = () => {
        if (history) history.back()
    }

    useEffect(() => {

    }, [])

    return (
        <div className="h-full flex flex-col overflow-hidden rounded-xl">
            <div
                className="h-20 flex flex-col md:flex-row justify-center items-center gap-4 bg-white sticky top-0 z-10 py-6 mx-6 pb-4 border-b border-b-gray-300">
                <Button variant="outline" onClick={handleBackButton} className="absolute left-0 hidden md:block">
                    Kembail
                </Button>
                <div>
                    <Heading headingLevel="h4" variant="section-title" className="text-center">DR.</Heading>
                </div>
            </div>
        </div>
    )
}

export default Register