"use client"
import React from "react";
import {Step} from "@/types/stepper";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Check} from "lucide-react";

interface StepperProps {
    steps: Step[];
    activeStep: number;
    stepperChange: React.Dispatch<React.SetStateAction<number>>
    children: React.ReactNode;
    action?: React.ReactNode;
}

const Stepper = ({steps, activeStep, stepperChange, children, action} : StepperProps) => {
    const styleStep = 'w-6 h-6 text-sm lg:w-10 lg:h-10 lg:text-normal rounded-full mx-auto mb-4 flex items-center justify-center font-medium transition-colors ease-out duration-300'
    const separatorStyle = 'flex-1 mt-3 lg:mt-5 h-0.5 transition-colors ease-in-out duration-400' ;
    const handlePrevStep = () => {
        if(activeStep <= steps.length){
            stepperChange(activeStep - 1)
        }
    }

    const handleNextStep = () => {
        if(activeStep <= steps.length && steps.length !== 0){
            stepperChange(activeStep + 1)
        }
    }
    return (
        <div>
            <div className="flex">
                {steps.map((step, index) => {
                    return (
                        <React.Fragment key={index}>
                            <div className="max-w-[6ch] lg:max-w-[10ch] w-full" key={index}>
                                <button
                                    type="button"
                                    onClick={() => stepperChange(Number(step.step))}
                                    className={cn(styleStep, (index+ 1 <= activeStep) ?
                                        'bg-red-600 text-white' :
                                        'bg-gray-200 text-gray-700',
                                        activeStep === index + 1 && ('ring-4 lg:ring-8 ring-red-200'))}>
                                    {
                                        index + 1 < activeStep ? (
                                            <Check className="w-4 h-4 lg:w-6 lg:h-6"/>
                                        ) : (
                                            step.step
                                        )
                                    }
                                </button>
                                <p className="text-xs md:text-sm text-gray-900 text-center">{step.title}</p>
                            </div>
                            {index !== steps.length - 1 && (
                                <div className={cn(separatorStyle, index + 1 < activeStep ? 'bg-red-600' : 'bg-gray-300')}></div>
                            )}
                        </React.Fragment>

                    )
                })}
            </div>
            <div>
                {children}
            </div>
            <div className="flex justify-end gap-2 mt-4">
                {
                    activeStep !== 1 && (
                        <Button variant="outline" typeof="button" onClick={handlePrevStep}>
                            Sebelumnya
                        </Button>
                    )
                }
                {
                    activeStep !== steps.length && (
                        <Button disabled={activeStep === steps.length} type="button" onClick={handleNextStep}>
                            Selanjutnya
                        </Button>
                    )
                }
                {action}
            </div>
        </div>
    )
}

export default Stepper
