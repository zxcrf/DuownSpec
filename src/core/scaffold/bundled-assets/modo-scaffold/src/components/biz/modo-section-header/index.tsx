import React from 'react';
import classNames from 'classnames';

export interface ModoSectionHeaderProps {
    title: React.ReactNode;
    icon?: React.ReactNode;
    extra?: React.ReactNode;
    className?: string;
}

export const ModoSectionHeader: React.FC<ModoSectionHeaderProps> = ({
    title,
    icon,
    extra,
    className
}) => {
    return (
        <div className={classNames('flex justify-between items-center py-2 mb-2', className)}>
            <div className="flex items-center gap-1.5">
                {icon && <div className="text-[16px] flex items-center text-text-2">{icon}</div>}
                <div className="text-[14px] font-medium text-text-1">
                    {title}
                </div>
            </div>
            {extra && <div className="text-text-3 text-[12px]">{extra}</div>}
        </div>
    );
};
