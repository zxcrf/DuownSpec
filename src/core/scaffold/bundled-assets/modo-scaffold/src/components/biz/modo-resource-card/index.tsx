import React from 'react';
import { Typography, Avatar, Tooltip, Dropdown, MenuProps } from 'antd';
import { WebSharedDuotone, MoreDuotone, TagsDuotone, LockDuotone } from 'modo-icon';
import classNames from 'classnames';
import { ModoButton } from '../modo-button';

const { Text } = Typography;

export interface ModoResourceCardProps {
    id: number | string;
    title: string;
    icon?: React.ReactNode;
    status?: 'success' | 'default' | 'error' | 'warning';
    description?: string;
    subText?: string;
    isPrivate?: boolean;
    tags?: string[];
    actions?: MenuProps['items'];
    onClick?: () => void;
    className?: string;
}

export const ModoResourceCard: React.FC<ModoResourceCardProps> = ({
    title,
    icon = <WebSharedDuotone className="!text-primary-6 text-[32px]" />,
    status = 'default',
    description,
    subText,
    isPrivate,
    tags = [],
    actions,
    onClick,
    className
}) => {
    // Status dot color mapping
    const statusColorMap = {
        success: 'bg-success-6 shadow-[0px_2px_5px_0px_rgba(85,188,138,0.3)]',
        default: 'bg-fill-4 shadow-[0px_2px_5px_0px_rgba(179,192,204,0.3)]',
        error: 'bg-danger-6 shadow-[0px_2px_5px_0px_rgba(195,52,47,0.3)]',
        warning: 'bg-warning-6 shadow-[0px_2px_5px_0px_rgba(245,166,35,0.3)]'
    };

    return (
        <div
            onClick={onClick}
            className={classNames(
                "bg-bg-1 rounded-lg border border-solid border-border-2 hover:border-primary-4 cursor-pointer hover:!shadow-mid transition-all flex flex-col p-4 min-h-[150px]",
                className
            )}
        >
            <div className="flex items-center gap-2">
                {/* Card Icon */}
                <Avatar
                    shape="square"
                    size={32}
                    className="!bg-transparent flex-shrink-0 rounded-[8px] flex items-center justify-center p-0"
                    icon={icon}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start w-full gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <Text strong className="!text-[14px] !text-text-1 truncate" title={title}>
                                {title}
                            </Text>
                            {isPrivate && (
                                <Tooltip title="私有">
                                    <LockDuotone className="text-text-2 text-[14px] flex-shrink-0 cursor-help" />
                                </Tooltip>
                            )}
                        </div>
                        {/* Status Rounded Dot */}
                        <span className={classNames("w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 mr-[5px]", statusColorMap[status])}></span>
                    </div>
                    {subText && (
                        <Text className="!text-[12px] mt-[2px] block truncate !text-text-2">
                            {subText}
                        </Text>
                    )}
                </div>
            </div>

            <div className="mt-[10px] !text-text-2 !text-[12px] flex-1 min-h-0 line-clamp-2 leading-[1.6]">
                {description}
            </div>

            {/* Actions Footer */}
            <div className="mt-4 flex justify-between items-center !text-text-2 !text-[12px]">
                <div className="flex items-center gap-1 hover:text-primary-6 cursor-pointer transition-colors">
                    <TagsDuotone className="text-[12px]" />
                    <span>{tags.length > 0 ? tags[0] : '添加标签'}</span>
                </div>
                {actions && actions.length > 0 && (
                    <Dropdown menu={{ items: actions }} trigger={['click']} placement="bottomRight">
                        <ModoButton
                            type="text"
                            size="small"
                            icon={<MoreDuotone className="text-text-2 text-[14px] hover:text-primary-6" />}
                            className="h-6 w-6 !p-0"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        />
                    </Dropdown>
                )}
            </div>
        </div>
    );
};
