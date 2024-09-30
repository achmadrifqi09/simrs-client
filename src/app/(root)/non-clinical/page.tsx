"use client"

import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import NonClinicalTable from "@/app/(root)/non-clinical/non-clinical-table";

const NonClinical = () =>{
     return (
         <>
          <Heading headingLevel="h3" variant="page-title">Non-Clinical</Heading>
             <div className="w-full">
                 <Section>
                     <NonClinicalTable/>
                 </Section>
             </div>
         </>
     )
}

export default NonClinical;