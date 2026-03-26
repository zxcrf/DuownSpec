import React from 'react';
import { Space, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { MoreDuotone } from 'modo-icon';
import ModoButton from '../modo-button';

export interface ActionItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    danger?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    visible?: boolean; // Default true
}

export interface ModoActionGroupProps {
    actions: ActionItem[];
    maxCount?: number; // Maximum number of visible buttons (default 2)
}

export const ModoActionGroup: React.FC<ModoActionGroupProps> = ({
    actions = [],
    maxCount = 2,
}) => {
    // Filter visible items first
    const visibleActions = actions.filter(action => action.visible !== false);

    if (visibleActions.length === 0) return null;

    // Use maxCount directly as the split point
    // If actions <= maxCount, show all. 
    // If actions > maxCount, show (maxCount - 1) buttons + 1 More button

    let primaryActions: ActionItem[] = [];
    let secondaryActions: ActionItem[] = [];

    if (visibleActions.length <= maxCount) {
        primaryActions = visibleActions;
    } else {
        // Show maxCount buttons, put the rest in dropdown
        primaryActions = visibleActions.slice(0, maxCount);
        secondaryActions = visibleActions.slice(maxCount);
    }

    const renderButton = (action: ActionItem) => (
        <ModoButton
            key={action.key}
            type="link"
            size="small"
            danger={action.danger}
            disabled={action.disabled}
            onClick={action.onClick}
            style={{ padding: '0 4px' }}
        >
            {action.label}
        </ModoButton>
    );

    const menuItems: MenuProps['items'] = secondaryActions.map(action => ({
        key: action.key,
        label: action.label,
        danger: action.danger,
        disabled: action.disabled,
        icon: action.icon,
        onClick: action.onClick,
    }));

    return (
        <Space size={4} role="group">
            {primaryActions.map(renderButton)}

            {secondaryActions.length > 0 && (
                <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                    <ModoButton type="link" size="small" style={{ padding: '0 4px', display: 'inline-flex', alignItems: 'center' }}>
                        <MoreDuotone width="14px" height="14px" />
                    </ModoButton>
                </Dropdown>
            )}
        </Space>
    );
};

export default ModoActionGroup;
