import React from 'react';
import { Radio } from 'antd';
import type { RadioProps } from 'antd';
import classNames from 'classnames';
import styles from './modo-radio.module.css';

export interface ModoRadioProps extends RadioProps {
    // No specific props added yet, just strict styling
}

export const ModoRadio: React.FC<ModoRadioProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <Radio
            className={classNames(
                styles['modo-radio'],
                className
            )}
            {...props}
        >
            {children}
        </Radio>
    );
};

export default ModoRadio;
