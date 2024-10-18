"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import {Button} from "@/components/ui/button";
import {Expand, Shrink} from "lucide-react";
import {useState} from "react";


const Dashboard = () => {
    const [fullScreen, setFullscreen] = useState<boolean>(false);
    const fullScreenStyle = "h-dvh w-screen absolute z-40 inset-0"
    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Dashboard</Heading>
            <Section>
                <div className="flex justify-end">
                    <Button className="mb-6 ms-auto gap-2" onClick={() => setFullscreen(!fullScreen)}>
                        <Expand className="w-4 h-4"/>
                        Full Screen
                    </Button>
                </div>
                {
                    fullScreen && (
                        <Button className="mb-6 ms-auto gap-2 absolute z-50 bottom-6 right-6" onClick={() => setFullscreen(false)}>
                            <Shrink className="w-4 h-4"/>
                            Minimize
                        </Button>
                    )
                }
                <iframe
                    src="https://docs.google.com/spreadsheets/d/1qFCuwOybSg_P2YIxzBKdyi1sC49WxIKIJ9b3q7WFYXw/edit?usp=sharing"
                    className={fullScreen ? fullScreenStyle : 'w-full h-content'}>

                </iframe>
            </Section>
        </>
    )
}

export default Dashboard