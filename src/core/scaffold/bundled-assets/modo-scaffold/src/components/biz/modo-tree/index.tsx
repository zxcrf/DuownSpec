'use client';

import React from 'react';
import { Tree, theme } from 'antd';
import type { TreeProps } from 'antd';
import { TriangleDownDuotone, TriangleRightDuotone } from 'modo-icon';
import styles from './modo-tree.module.css';

export interface ModoTreeProps extends TreeProps {
    compact?: boolean;
}

export const ModoTree: React.FC<ModoTreeProps> = ({
    compact = true,
    blockNode = true,
    showLine = false,
    switcherIcon,
    className = '',
    rootClassName = '',
    ...props
}) => {
    const { token } = theme.useToken();

    // Custom switcher logic: 12x12 Container with rounded corners
    const customSwitcher = (nodeProps: any) => {
        if (nodeProps.isLeaf) return null;

        return (
            <div className={`ant-tree-switcher-icon ${nodeProps.expanded ? 'expanded' : ''}`} style={{
                width: 12,
                height: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: token.colorFillAlter || '#EFF4F9', // Fallback
                borderRadius: 2,
                flexShrink: 0
            }}>
                {nodeProps.expanded ? (
                    <TriangleDownDuotone width="8px" height="8px" color={token.colorTextSecondary} />
                ) : (
                    <TriangleRightDuotone width="8px" height="8px" color={token.colorTextSecondary} />
                )}
            </div>
        );
    };

    return (
        <div className={`modo-tree-wrapper ${compact ? styles.compact : ''}`}>
            <Tree
                blockNode={blockNode}
                switcherIcon={switcherIcon || customSwitcher}
                showLine={showLine}
                className={className}
                rootClassName={rootClassName}
                {...props}
            />
        </div>
    );
};

export default ModoTree;
