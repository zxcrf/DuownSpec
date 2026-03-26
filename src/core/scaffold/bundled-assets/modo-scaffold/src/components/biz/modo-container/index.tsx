import React from 'react';
import classNames from 'classnames';
import styles from './modo-container.module.css';

export interface ModoContainerProps {
    className?: string;
    style?: React.CSSProperties;
    width?: number | string;
    height?: number | string;
    contentClassName?: string;
    contentStyle?: React.CSSProperties;
    children?: React.ReactNode;
}

export const ModoContainer: React.FC<ModoContainerProps> = ({
    className,
    style,
    width = '100%',
    height = '100%',
    contentClassName,
    contentStyle,
    children
}) => {
    // 合并自定义高宽至 wrapper 样式
    const wrapperStyle: React.CSSProperties = {
        width,
        height,
        ...style
    };

    return (
        <div className={classNames(styles['container-wrapper'], className)} style={wrapperStyle}>
            <div className={classNames(styles['container-content'], contentClassName)} style={contentStyle}>
                {children}
            </div>
        </div>
    );
};
