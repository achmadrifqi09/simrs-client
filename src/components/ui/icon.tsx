import React from "react";
import * as LucideIcons from 'react-icons/lu';

type IconProps = {
    nameIcon: keyof typeof LucideIcons | string;
};

const Icon = ({ nameIcon }: IconProps): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const ElementIcon = LucideIcons[nameIcon] || LucideIcons.LuImageOff;
    return <ElementIcon className="w-5 h-5"/>;
};

export default Icon;
