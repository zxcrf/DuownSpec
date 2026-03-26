'use client';

import React from 'react';
import { Pagination, PaginationProps } from 'antd';
import styles from './modo-pagination.module.css';
import classNames from 'classnames';

export interface ModoPaginationProps extends PaginationProps {
    /**
     * Additional class name for the container
     */
    containerClassName?: string;
}

/**
 * ModoPagination - A styled pagination component for one-screen adaptive layouts.
 * 
 * Features:
 * - Consistent footer styling with background color
 * - Preset defaults: showSizeChanger, showQuickJumper, showTotal
 */
export const ModoPagination: React.FC<ModoPaginationProps> = ({
    showSizeChanger = true,
    showQuickJumper = true,
    showTotal = (total) => `共 ${total} 条`,
    simple = true,
    containerClassName,
    ...props
}) => {
    return (
        <div className={classNames(styles['pagination-container'], containerClassName)}>
            <Pagination
                simple={simple}
                showSizeChanger={showSizeChanger}
                showQuickJumper={showQuickJumper}
                showTotal={showTotal}
                {...props}
            />
        </div>
    );
};

export default ModoPagination;
