import Heading from "@/components/ui/heading";
import SolidCard from "@/components/ui/solid-card";
import Section from "@/components/ui/section";

const Pharmacy = () => {
    return (
        <>
            <Section>
                <Heading headingLevel="h5">Daftar Loket Farmasi</Heading>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                    <SolidCard href="/queue/counter/1">
                        <p>Loket 1</p>
                    </SolidCard>
                    <SolidCard href="/queue/counter/2">
                        <p>Loket 2</p>
                    </SolidCard>
                    <SolidCard href="/queue/counter/3">
                        <p>Loket 3</p>
                    </SolidCard>
                </div>
            </Section>
        </>
    )
}

export default Pharmacy