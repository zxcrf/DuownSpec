import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Row, Col, Space, Tooltip, Tag, FormInstance } from 'antd';
import { ModoButton } from '../modo-button';
/**
 * PageFilter Component
 * Interaction Spec: docs/interactions/page-filter.md
 */
import { FilterDuotone, BroomDuotone } from 'modo-icon';

interface PageFilterProps {
    form: FormInstance;
    onSearch: (values: any) => void;
    onReset: () => void;
    searchParams: Record<string, any>;
    setSearchParams: (params: Record<string, any>) => void;
    labelMap: Record<string, string>;
    valueMap?: Record<string, Record<string, any>>;
    children: React.ReactNode;
}

export const PageFilter: React.FC<PageFilterProps> = ({
    form,
    onSearch,
    onReset,
    searchParams,
    setSearchParams,
    labelMap,
    valueMap = {},
    children
}) => {
    const [expand, setExpand] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [placeholderHeight, setPlaceholderHeight] = useState<number | undefined>(undefined);

    // Filter out empty values
    const getCleanValues = (values: any) => {
        return Object.fromEntries(
            Object.entries(values).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );
    };

    const handleSearch = (values: any) => {
        const cleanValues = getCleanValues(values);
        setSearchParams(cleanValues);
        onSearch(cleanValues);
    };

    const handleReset = () => {
        form.resetFields();
        setSearchParams({});
        onReset();
    };

    const onCloseFilterTag = (key: string) => {
        const newParams = { ...searchParams };
        delete newParams[key];
        form.setFieldValue(key, undefined);
        setSearchParams(newParams);
        onSearch(newParams);
    };

    // Wrap label with fixed 4-char width, truncation, and Tooltip
    const wrapLabel = (label: React.ReactNode): React.ReactNode => {
        if (!label) return label;
        const labelText = typeof label === 'string' ? label : '';
        return (
            <Tooltip title={labelText}>
                <span
                    style={{
                        display: 'inline-block',
                        width: '48px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        verticalAlign: 'middle',
                    }}
                >
                    {label}
                </span>
            </Tooltip>
        );
    };

    // Process children to wrap Form.Item labels
    const processChildren = (nodes: React.ReactNode): React.ReactNode[] => {
        return React.Children.map(nodes, (child) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const el = child as any;
            if (React.isValidElement(child) && el.props?.label !== undefined) {
                return React.cloneElement(el, { label: wrapLabel(el.props.label) });
            }
            return child;
        }) || [];
    };

    const renderFilterTags = () => {
        const tags: React.ReactNode[] = [];
        Object.keys(searchParams).forEach(key => {
            const val = searchParams[key];
            if (val !== undefined && val !== null && val !== '') {
                let displayVal = val;
                if (valueMap[key] && valueMap[key][val] !== undefined) {
                    displayVal = valueMap[key][val];
                }
                tags.push(
                    <Tag
                        closable
                        onClose={() => onCloseFilterTag(key)}
                        key={key}
                        className="m-0 !text-[12px] !bg-[var(--color-modo-1)] !border-transparent !text-[var(--color-modo-6)] rounded-[2px] px-[6px] py-0 h-[20px] leading-[20px] !inline-flex !items-center !gap-[4px] [&_.ant-tag-close-icon]:!m-0 [&_.ant-tag-close-icon]:!ml-[4px] [&_.ant-tag-close-icon]:!inline-flex [&_.ant-tag-close-icon]:!items-center [&_.ant-tag-close-icon]:!text-[7px] [&_.ant-tag-close-icon]:!text-[var(--color-modo-6)]"
                    >
                        {labelMap[key] || key} : {displayVal}
                    </Tag>
                );
            }
        });
        return tags;
    };

    const items = processChildren(children);
    const initialItems = items.slice(0, 3);
    const extraItems = items.slice(3);

    // isOverlay: keep absolute position during both expand AND close animation
    const isOverlay = (expand || isClosing) && extraItems.length > 0;

    useEffect(() => {
        if (!expand && !isClosing && containerRef.current) {
            setPlaceholderHeight(containerRef.current.offsetHeight);
        }
    }, [expand, isClosing, searchParams]);

    const handleToggleExpand = () => {
        if (expand) {
            // Collapse: first trigger close animation, keep overlay during animation
            setExpand(false);
            setIsClosing(true);
            setTimeout(() => setIsClosing(false), 300);
        } else {
            setExpand(true);
        }
    };

    return (
        <div className="relative w-full z-10" style={{ height: isOverlay ? placeholderHeight : 'auto' }}>
            <div
                ref={containerRef}
                className="flex flex-col w-full"
                style={{
                    position: isOverlay ? 'absolute' : 'relative',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: isOverlay ? 50 : 'auto',
                    background: expand ? '#fff' : '#F9FBFD',
                    padding: expand ? '16px' : '10px 16px',
                    boxShadow: expand ? '0 4px 10px 0 rgba(36,46,67,0.1)' : 'none',
                    borderRadius: expand ? '4px' : '2px',
                    gap: expand ? '10px' : '6px',
                    transition: 'background 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease, border-radius 0.3s ease',
                }}
            >
                <Form form={form} onFinish={handleSearch} colon={false} className="w-full">
                    <div className="flex gap-[16px] items-start w-full">
                        <div className="flex-1 min-w-0 w-full">
                            <Row gutter={[20, 10]}>
                                {initialItems.map((item, index) => (
                                    <Col span={8} key={`initial-${index}`} style={{ height: '28px' }}>
                                        <div className="h-[28px] overflow-hidden">{item}</div>
                                    </Col>
                                ))}
                            </Row>
                            {extraItems.length > 0 && (
                                <div
                                    style={{
                                        maxHeight: expand ? `${Math.ceil(extraItems.length / 3) * 38 + 10}px` : '0',
                                        opacity: expand ? 1 : 0,
                                        overflow: 'hidden',
                                        transition: 'max-height 0.3s ease, opacity 0.25s ease',
                                    }}
                                >
                                    <Row gutter={[20, 10]} style={{ marginTop: '10px' }}>
                                        {extraItems.map((item, index) => (
                                            <Col span={8} key={`extra-${index}`} style={{ height: '28px' }}>
                                                <div className="h-[28px] overflow-hidden">{item}</div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}
                        </div>

                        {/* Buttons - always in the same position */}
                        <div className="flex items-start justify-end gap-[10px] shrink-0">
                            <Tooltip title="重置">
                                <ModoButton type="text" shape="circle" className="bg-[#EFF4F9] hover:bg-[#E3E9EF] border-none flex items-center justify-center p-[8px]" style={{ width: 28, height: 28 }} icon={<BroomDuotone className="text-[12px] text-[#79879C]" />} onClick={handleReset} />
                            </Tooltip>
                            {items.length > 3 && (
                                <Tooltip title={expand ? "收起" : "展开筛选"}>
                                    <ModoButton type="text" shape="circle" className="bg-[#EFF4F9] hover:bg-[#E3E9EF] border-none flex items-center justify-center p-[8px]" style={{ width: 28, height: 28 }} onClick={handleToggleExpand} icon={<FilterDuotone className="text-[12px] text-[#79879C]" />} />
                                </Tooltip>
                            )}
                            <ModoButton type="primary" htmlType="submit" className="bg-[#3261ce] rounded-full min-w-[72px] h-[28px] text-[12px] px-[12px] py-[4px] border-none">
                                查询
                            </ModoButton>
                        </div>
                    </div>
                </Form>

                {/* Condition Tags */}
                <div className="flex text-[12px] w-full items-start h-[20px] leading-[20px]">
                    <div className="flex items-start flex-1">
                        <p className="shrink-0 text-[#79879C] whitespace-pre-wrap flex items-center h-full">已筛选条件：</p>
                        <div className="flex items-center flex-wrap gap-[4px] h-full">
                            {Object.keys(searchParams).length > 0 ? (
                                <>{renderFilterTags()}</>
                            ) : (
                                <p className="text-[#242E43] flex items-center h-full">全部</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
