'use client';

import React, { FC } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';

export interface ModoSelectProps extends SelectProps {
}

interface ModoSelectInternal extends FC<ModoSelectProps> {
    Option: typeof Select.Option;
}

/**
 * ModoSelect - Standard select component for MODO Design System.
 * Default variant is set to 'filled'.
 */
export const ModoSelect: ModoSelectInternal = ({
    variant = 'filled',
    placeholder = '请选择',
    allowClear = true,
    style,
    ...props
}) => {
    return (
        <Select
            variant={variant}
            placeholder={placeholder}
            allowClear={allowClear}
            style={{ width: '100%', ...style }}
            {...props}
        />
    );
};

ModoSelect.Option = Select.Option;

export default ModoSelect;
