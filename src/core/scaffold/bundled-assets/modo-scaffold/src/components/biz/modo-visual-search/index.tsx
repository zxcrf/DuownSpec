import React, { useState, useRef, useEffect } from 'react';
import { Dropdown, MenuProps } from 'antd';
import { MagnifierDuotone, CloseDuotone } from 'modo-icon';
import classNames from 'classnames';

export interface SearchField {
    key: string;
    label: string;
    type: 'input' | 'select';
    options?: { label: string; value: string }[];
}

export interface SearchToken {
    field: string;
    fieldLabel: string;
    value: string;
    valueLabel: string;
}

interface ModoVisualSearchProps {
    fields: SearchField[];
    value?: SearchToken[];
    onChange?: (tokens: SearchToken[], rawText: string) => void;
    placeholder?: string;
    className?: string;
}

export const ModoVisualSearch: React.FC<ModoVisualSearchProps> = ({
    fields,
    value = [],
    onChange,
    placeholder = "搜索",
    className
}) => {
    const [tokens, setTokens] = useState<SearchToken[]>(value);
    const [inputValue, setInputValue] = useState('');
    const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (value !== tokens) {
            setTokens(value);
        }
    }, [value]);

    const notifyChange = (newTokens: SearchToken[], currentText: string) => {
        setTokens(newTokens);
        onChange?.(newTokens, currentText);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        if (!activeFieldKey) {
            onChange?.(tokens, val);
        }
    };

    const activeField = fields.find(f => f.key === activeFieldKey);

    let menuItems: MenuProps['items'] = [];

    if (!activeFieldKey) {
        const usedFieldKeys = new Set(tokens.map(t => t.field));
        menuItems = fields
            .filter(f => !usedFieldKeys.has(f.key) && f.label.toLowerCase().includes(inputValue.toLowerCase()))
            .map(f => ({
                key: f.key,
                label: <div onMouseDown={(e) => e.preventDefault()} className="text-text-2 w-full text-[12px] py-0.5 px-1">{f.label}</div>,
                onClick: () => {
                    setActiveFieldKey(f.key);
                    setInputValue('');
                    onChange?.(tokens, '');
                    inputRef.current?.focus();
                }
            }));
    } else if (activeField?.type === 'select') {
        menuItems = (activeField.options || [])
            .filter(opt => opt.label.toLowerCase().includes(inputValue.toLowerCase()))
            .map(opt => ({
                key: opt.value,
                label: <div onMouseDown={(e) => e.preventDefault()} className="text-text-2 w-full text-[12px] py-0.5 px-1">{opt.label}</div>,
                onClick: () => {
                    const newTokens = [
                        ...tokens,
                        { field: activeField.key, fieldLabel: activeField.label, value: opt.value, valueLabel: opt.label }
                    ];
                    setActiveFieldKey(null);
                    setInputValue('');
                    notifyChange(newTokens, '');
                    inputRef.current?.focus();
                }
            }));
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && inputValue === '') {
            if (activeFieldKey) {
                setActiveFieldKey(null);
            } else if (tokens.length > 0) {
                const newTokens = tokens.slice(0, -1);
                notifyChange(newTokens, '');
            }
        }
        if (e.key === 'Enter') {
            if (activeFieldKey && activeField?.type === 'input' && inputValue.trim()) {
                const newTokens = [
                    ...tokens,
                    { field: activeField.key, fieldLabel: activeField.label, value: inputValue.trim(), valueLabel: inputValue.trim() }
                ];
                setActiveFieldKey(null);
                setInputValue('');
                notifyChange(newTokens, '');
            } else if (!activeFieldKey && inputValue.trim() && fields.length > 0) {
                e.preventDefault();
            }
        }
    };

    const removeToken = (index: number) => {
        const newTokens = [...tokens];
        newTokens.splice(index, 1);
        notifyChange(newTokens, activeFieldKey ? '' : inputValue);
    };

    const clearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveFieldKey(null);
        setInputValue('');
        notifyChange([], '');
        inputRef.current?.focus();
    };

    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    return (
        <Dropdown
            menu={{ items: menuItems }}
            open={isFocused && menuItems.length > 0}
            trigger={['click']}
            getPopupContainer={(triggerNode) => triggerNode}
            overlayClassName="w-[200px]"
            placement="bottomLeft"
        >
            <div
                className={classNames(
                    "ant-dropdown-trigger flex items-center min-h-[28px] rounded-full border border-solid transition-colors duration-200 px-3 cursor-text",
                    (isFocused || tokens.length > 0) ? "border-primary-5 bg-bg-1" : "border-border-1 bg-fill-2 hover:border-primary-4",
                    className
                )}
                onClick={handleContainerClick}
            >
                <MagnifierDuotone className="text-text-2 mr-2 text-[14px] flex-shrink-0" />

                <div className="flex flex-wrap items-center gap-1.5 flex-1 overflow-hidden py-[3px]">
                    {tokens.map((token, index) => (
                        <div key={index} className="flex items-center h-5 bg-primary-light-1 text-primary-6 px-2 rounded-[10px] text-[12px] leading-none font-medium whitespace-nowrap">
                            <span>{token.fieldLabel}: {token.valueLabel}</span>
                            <CloseDuotone
                                className="ml-[6px] text-[12px] cursor-pointer hover:text-primary-7 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeToken(index);
                                }}
                            />
                        </div>
                    ))}

                    {activeFieldKey && (
                        <span className="text-primary-6 text-[12px] font-medium whitespace-nowrap">{activeField?.label}:</span>
                    )}

                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 min-w-[30px] bg-transparent border-none outline-none text-text-1 text-[12px] placeholder:text-text-4 h-5"
                        placeholder={tokens.length === 0 && !activeFieldKey ? placeholder : ''}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
                            setIsFocused(true);
                        }}
                        onBlur={() => {
                            blurTimeoutRef.current = setTimeout(() => setIsFocused(false), 200);
                        }}
                    />
                </div>

                {(tokens.length > 0 || inputValue || activeFieldKey) && (
                    <CloseDuotone
                        className="text-text-2 hover:text-text-1 cursor-pointer ml-2 flex-shrink-0 transition-colors text-[14px]"
                        onClick={clearAll}
                    />
                )}
            </div>
        </Dropdown>
    );
};
