import React from 'react';
import { Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';
import classNames from 'classnames';
import styles from './modo-checkbox.module.css';

export interface ModoCheckboxProps extends CheckboxProps {
    /** 
     * Compact mode for smaller size (14px) instead of default (16px) 
     */
    compact?: boolean;
}

export const ModoCheckbox: React.FC<ModoCheckboxProps> = ({
    className,
    compact,
    children,
    ...props
}) => {
    return (
        <Checkbox
            className={classNames(
                styles['modo-checkbox'],
                { [styles.compact]: compact },
                className
            )}
            {...props}
        >
            {children}
        </Checkbox>
    );
};

export default ModoCheckbox;
