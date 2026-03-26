'use client';

import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import styles from './modo-table.module.css';
import classNames from 'classnames';

export interface ModoTableProps<T> extends Omit<TableProps<T>, 'pagination'> {
    /**
     * Additional class name for the container
     */
    containerClassName?: string;
}

/**
 * ModoTable - A Table component designed for one-screen adaptive layouts.
 * 
 * Features:
 * - Flex-based layout that fills available height
 * - White table header theme with no separators
 * - Custom size variants:
 *   - default: Compact 36px row height
 *   - large: Spacious 58px row height
 * 
 * Note: Use with ModoPagination for pagination footer.
 */
export function ModoTable<T extends object>({
    scroll,
    containerClassName,
    ...tableProps
}: ModoTableProps<T>) {
    const defaultScroll = { x: 1000, y: '100.1%' };
    const mergedScroll = scroll ? { ...defaultScroll, ...scroll } : defaultScroll;

    // Determine the size class based on the size prop
    const sizeClass = tableProps.size === 'large' ? styles['size-large'] : styles['size-default'];

    return (
        <div className={classNames(styles['modo-table'], sizeClass, containerClassName)}>
            <Table<T>
                scroll={mergedScroll}
                pagination={false}
                {...tableProps}
            />
        </div>
    );
}

export default ModoTable;
