'use client';

import React from 'react';
import { Drawer, Space } from 'antd';
import type { DrawerProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import styles from './modo-drawer.module.css';
import classNames from 'classnames';
import { ModoButton } from '../modo-button';

export interface ModoDrawerProps extends Omit<DrawerProps, 'extra' | 'footer' | 'closable'> {
    /**
     * Callback when the cancel button is clicked
     */
    onCancel?: () => void;
    /**
     * Callback when the confirm button is clicked
     */
    onOk?: () => void;
    /**
     * Text for the cancel button
     * @default '取消'
     */
    cancelText?: string;
    /**
     * Text for the confirm button
     * @default '确定'
     */
    okText?: string;
    /**
     * Whether the confirm button is loading
     */
    confirmLoading?: boolean;
    /**
     * Whether to show the footer buttons
     * @default true
     */
    showFooter?: boolean;
    /**
     * Custom footer content (overrides default buttons)
     */
    footer?: React.ReactNode;
}

/**
 * ModoDrawer - A styled Drawer component with consistent layout.
 * 
 * Features:
 * - Close button in the top-right corner of the header
 * - Cancel and Confirm buttons in the footer (right-aligned)
 * - Consistent styling across the application
 */
export const ModoDrawer: React.FC<ModoDrawerProps> = ({
    onCancel,
    onOk,
    onClose,
    cancelText = '取消',
    okText = '确定',
    confirmLoading,
    showFooter = true,
    footer,
    children,
    className,
    styles: drawerStyles,
    ...props
}) => {
    const handleClose: DrawerProps['onClose'] = (e) => {
        onCancel?.();
        onClose?.(e);
    };

    const handleCancelClick = () => {
        onCancel?.();
    };

    // Determine footer content
    const getFooter = () => {
        if (footer !== undefined) return footer;
        if (!showFooter) return false; // Completely hide footer
        return (
            <div className="flex justify-end">
                <Space>
                    <ModoButton onClick={handleCancelClick}>{cancelText}</ModoButton>
                    <ModoButton type="primary" loading={confirmLoading} onClick={onOk}>{okText}</ModoButton>
                </Space>
            </div>
        );
    };

    const { width, size, ...drawerProps } = props;

    // Fix AntD Drawer width deprecation warning by moving it to styles.wrapper.width
    // Using any cast since TypeScript in some environments doesn't recognize the wrapper 
    // property on DrawerStylesType despite it being supported at runtime.
    const combinedDrawerStyles = {
        ...drawerStyles,
        wrapper: {
            ...(drawerStyles as any)?.wrapper,
            ...(width ? { width } : {}),
        }
    };

    return (
        <Drawer
            className={classNames(styles['modo-drawer'], className)}
            styles={combinedDrawerStyles as any}
            size={size}
            autoFocus={false}
            destroyOnClose={true}
            closable={false}
            onClose={handleClose}
            extra={
                <CloseOutlined
                    onClick={handleCancelClick}
                    className={styles['close-icon']}
                />
            }
            footer={getFooter()}
            {...drawerProps}
        >
            {children}
        </Drawer>
    );
};

export default ModoDrawer;
