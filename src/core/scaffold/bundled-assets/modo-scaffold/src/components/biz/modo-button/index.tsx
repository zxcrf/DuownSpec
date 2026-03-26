'use client';

import React from 'react';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';

import styles from './modo-button.module.css';

export interface ModoButtonProps extends Omit<ButtonProps, 'color'> {
    children?: React.ReactNode;
    extraLarge?: boolean;
    color?: ButtonProps['color'] | string;
}

/**
 * ModoButton - A simple wrapper around Ant Design Button.
 */
const getSizeStyles = (size?: 'small' | 'middle' | 'large', extraLarge?: boolean) => {
    if (extraLarge) {
        return {
            height: '36px',
            padding: '0 20px',
            fontSize: '14px',
            lineHeight: '34px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
        };
    }

    switch (size) {
        case 'small':
            return {
                height: '24px',
                padding: '0 8px',
                fontSize: '12px',
                lineHeight: '22px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
            };
        case 'large':
            return {
                height: '32px',
                padding: '0 16px',
                fontSize: '14px',
                lineHeight: '30px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
            };
        case 'middle':
        default:
            return {
                height: '28px',
                padding: '0 12px',
                fontSize: '12px',
                lineHeight: '26px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
            };
    }
};

export const ModoButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ModoButtonProps>(
    ({ shape = 'round', size, extraLarge, style, color, children, ...props }, ref) => {
        const sizeStyles = getSizeStyles(size, extraLarge);
        const isIconButton = !!props.icon && !children;

        if (isIconButton) {
            sizeStyles.padding = '0';
            const sizeValues = { small: '24px', middle: '28px', large: '32px' };
            const height = extraLarge ? '36px' : (sizeValues[size || 'middle']);
            (sizeStyles as any).width = height;
        }

        const isTextOrLink = props.type === 'text' || props.type === 'link';
        const isCircle = shape === 'circle' || (props.className && props.className.includes('ant-btn-circle'));

        if (isCircle) {
            sizeStyles.padding = '0';
        }

        const minWidthStyle = (!isIconButton && !isTextOrLink && !isCircle) ? { minWidth: '72px' } : {};

        // In Antd 6, the default appearance is an outlined button.
        // For Modo's flattened gray background default button, we map it to the 'filled' variant.
        const defaultVariantProps: any = {};
        if (!props.type && !(props as any).variant && !props.danger) {
            defaultVariantProps.variant = 'filled';
            defaultVariantProps.color = color || 'default';
        }

        return (
            <Button
                ref={ref}
                {...defaultVariantProps}
                {...props}
                className={`${styles.modoButton} ${props.className || ''}`}
                shape={shape}
                size={size}
                // @ts-ignore
                color={props.color || defaultVariantProps.color}
                style={{ ...sizeStyles, ...minWidthStyle, ...style }}
            >
                {children}
            </Button>
        );
    }
);

ModoButton.displayName = 'ModoButton';

export default ModoButton;
