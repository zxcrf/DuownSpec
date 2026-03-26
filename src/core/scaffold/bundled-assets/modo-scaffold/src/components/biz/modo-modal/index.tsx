'use client';

import React from 'react';
import { Modal, Space } from 'antd';
import type { ModalProps } from 'antd';
import classNames from 'classnames';
import styles from './modo-modal.module.css';
import { ModoButton } from '@/components/modo-button';

export interface ModoModalProps extends Omit<ModalProps, 'footer'> {
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
 * ModoModal - A styled Modal component following the Modo design system.
 * 
 * Features:
 * - Header/Footer with separator lines
 * - Custom padding and border radius
 * - Uses ModoButton in footer
 * - Right-aligned footer buttons
 */
export const ModoModal: React.FC<ModoModalProps> = ({
    onCancel,
    onOk,
    cancelText = '取消',
    okText = '确定',
    confirmLoading,
    showFooter = true,
    footer,
    children,
    className,
    ...props
}) => {
    // Custom footer rendering
    const renderFooter = () => {
        // If footer is explicitly provided as null, don't show footer
        if (footer === null) return null;
        // If footer is provided as a ReactNode, show it
        if (footer !== undefined) return footer;
        // If showFooter is false, don't show footer
        if (!showFooter) return null;

        return (
            <div className="flex justify-end">
                <Space size={12}>
                    <ModoButton onClick={onCancel}>
                        {cancelText}
                    </ModoButton>
                    <ModoButton
                        type="primary"
                        loading={confirmLoading}
                        onClick={onOk}
                    >
                        {okText}
                    </ModoButton>
                </Space>
            </div>
        );
    };

    return (
        <Modal
            className={classNames(styles['modo-modal'], className)}
            onCancel={onCancel}
            onOk={onOk}
            confirmLoading={confirmLoading}
            footer={renderFooter()}
            centered
            destroyOnHidden
            {...props}
        >
            {children}
        </Modal>
    );
};

export default ModoModal;
