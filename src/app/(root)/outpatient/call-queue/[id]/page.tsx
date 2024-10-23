"use client"
import { useSearchParams} from "next/navigation";
import Section from "@/components/ui/section";
import Heading from "@/components/ui/heading";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {Skeleton} from "@/components/ui/skeleton";

// type CallQueueParams = {
//     id: string;
// }
const PolyclinicCounterDetail = () => {
    const {status} = useSession();
    // const param = useParams<CallQueueParams>()
    const searchParams = useSearchParams()
    return (
        <>
            <Heading headingLevel="h3" variant="page-title">{searchParams.get('poly_name')}</Heading>
            <Section>
                <Tabs defaultValue="queue" className="w-full">
                    {status === 'loading' ? (
                        <div className="flex items-center justify-between">
                            <Skeleton className="w-16 h-10"/>
                            <Skeleton className="w-1/4 h-10"/>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                            >
                                <Link href="/outpatient/call-queue">
                                    Kembali
                                </Link>
                            </Button>
                            <TabsList>
                                <TabsTrigger value="queue" className="leading-relaxed">Antrean</TabsTrigger>
                                <TabsTrigger value="inspection" className="leading-relaxed">Pemeriksaan</TabsTrigger>
                                <TabsTrigger value="queue-completed" className="leading-relaxed">Antrean
                                    Selesai</TabsTrigger>
                            </TabsList>

                        </div>
                    )
                    }
                    <TabsContent value="queue">
                        <div className="mt-6 space-y-4">
                            <Heading headingLevel="h4" variant="section-title">
                                Daftar Antrean
                            </Heading>
                            {
                                status === 'loading' ? (
                                    <Skeleton className="w-1/3 h-4"/>
                                ) : (
                                    <p className="text-gray-500 leading-relaxed">Lorem ipsum dolor sit amet, consectetur
                                        adipisicing elit. Labore, velit.</p>
                                )
                            }
                        </div>
                    </TabsContent>
                    <TabsContent value="inspection">
                        <div className="mt-6 space-y-4">
                            <Heading headingLevel="h4" variant="section-title">
                                Pemeriksaan Poliklinik
                            </Heading>
                            {
                                status === 'loading' ? (
                                    <Skeleton className="w-1/3 h-4"/>
                                ) : (
                                    <p className="text-gray-500 leading-relaxed">Lorem ipsum dolor sit amet, consectetur
                                        adipisicing elit. A amet blanditiis dolorem pariatur quis!</p>
                                )
                            }
                        </div>
                    </TabsContent>
                    <TabsContent value="queue-completed">
                        <div className="mt-6 space-y-4">
                            <Heading headingLevel="h4" variant="section-title">
                                Antrean Selesai
                            </Heading>
                            {
                                status === 'loading' ? (
                                    <Skeleton className="w-1/3 h-4"/>
                                ) : (
                                    <p className="text-gray-500 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                                )
                            }
                        </div>
                    </TabsContent>
                </Tabs>

            </Section>
        </>
    )
}

export default PolyclinicCounterDetail
