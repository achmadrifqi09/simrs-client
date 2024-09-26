import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import SolidCard from "@/components/ui/solid-card";

const Admission = () => {
    return (
        <>
            <Section>
                <Heading headingLevel="h5">Daftar Loket Admisi</Heading>
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
                    <SolidCard href="/queue/counter/4">
                        <p>Loket 4</p>
                    </SolidCard>
                    <SolidCard href="/queue/counter/5">
                        <p>Loket 5</p>
                    </SolidCard>
                    <SolidCard href="/queue/counter/6">
                        <p>Loket 6</p>
                    </SolidCard>
                    <SolidCard href="/queue/counter/7">
                        <p>Loket 7</p>
                    </SolidCard>
                    <SolidCard href="/queue/counter/8">
                        <p>Loket 8</p>
                    </SolidCard>
                </div>
            </Section>
        </>
    )
}

export default Admission