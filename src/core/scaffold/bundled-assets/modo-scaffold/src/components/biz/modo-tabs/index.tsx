import { Tabs, TabsProps, Tooltip } from 'antd';
import classNames from 'classnames';
import styles from './modo-tabs.module.css';

export interface ModoTabsProps extends TabsProps {
    // You can add custom props here if needed
}

export const ModoTabs: React.FC<ModoTabsProps> = ({ className, items, ...props }) => {
    // 处理动态标签页的文字长度限制
    const processedItems = items?.map((item, index) => {
        const labelStr = typeof item.label === 'string' ? item.label : null;

        // 只有在是字符串且长度超过 7 的时候才处理 (第一页除外，第一页通常是页面标题)
        if (labelStr && labelStr.length > 7 && index !== 0) {
            return {
                ...item,
                label: (
                    <Tooltip title={labelStr}>
                        <span className={styles['tab-label-truncated']}>
                            {labelStr.slice(0, 7)}...
                        </span>
                    </Tooltip>
                )
            };
        }
        return item;
    });

    return (
        <Tabs
            className={classNames(styles['modo-tabs'], className)}
            items={processedItems}
            {...props}
        />
    );
};
