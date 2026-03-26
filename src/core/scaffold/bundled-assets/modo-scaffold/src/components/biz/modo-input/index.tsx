'use client';

import React from 'react';
import { Input as AntInput } from 'antd';
import type { InputProps, InputRef } from 'antd';
import styles from './modo-input.module.css';
import classNames from 'classnames';

// Re-export Input sub-components with custom styling
const { TextArea, Search, Password } = AntInput;

export interface ModoInputProps extends InputProps {
    // Extend if needed
}

/**
 * ModoInput - A styled Input component with consistent background color.
 * 
 * Features:
 * - Default background color: #EFF4F9
 * - Inherits all Ant Design Input props
 */
export const ModoInput = React.forwardRef<InputRef, ModoInputProps>(
    ({ className, ...props }, ref) => {
        return (
            <AntInput
                ref={ref}
                className={classNames(styles['modo-input'], className)}
                {...props}
            />
        );
    }
);

ModoInput.displayName = 'ModoInput';

// Export sub-components with custom wrapper
export const ModoTextArea = React.forwardRef<any, React.ComponentProps<typeof TextArea>>(
    ({ className, ...props }, ref) => {
        return (
            <TextArea
                ref={ref}
                className={classNames(styles['modo-input'], className)}
                {...props}
            />
        );
    }
);

ModoTextArea.displayName = 'ModoTextArea';

export const ModoSearch = React.forwardRef<InputRef, React.ComponentProps<typeof Search>>(
    ({ className, ...props }, ref) => {
        return (
            <Search
                ref={ref}
                className={classNames(styles['modo-input'], className)}
                {...props}
            />
        );
    }
);

ModoSearch.displayName = 'ModoSearch';

export const ModoPassword = React.forwardRef<InputRef, React.ComponentProps<typeof Password>>(
    ({ className, ...props }, ref) => {
        return (
            <Password
                ref={ref}
                className={classNames(styles['modo-input'], className)}
                {...props}
            />
        );
    }
);

ModoPassword.displayName = 'ModoPassword';

export default ModoInput;
