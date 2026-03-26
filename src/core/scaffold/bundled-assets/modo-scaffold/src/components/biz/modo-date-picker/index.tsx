'use client';

import React from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import type {
    DatePickerProps,
    RangePickerProps,
} from 'antd/es/date-picker';
import classNames from 'classnames';
import styles from './modo-date-picker.module.css';
import { CalendarDuotone, SubtractDuotone } from 'modo-icon';

const { RangePicker: AntRangePicker } = AntDatePicker;

// 默认日历图标（三级文字色，与设计规范保持一致）
const DEFAULT_SUFFIX_ICON = <CalendarDuotone className="text-text-3 text-[14px]" />;

// 默认分隔图标（类减号，三级文字色）
const DEFAULT_SEPARATOR = <SubtractDuotone className="text-text-3 text-[14px]" />;

// ─── ModoDatePicker ────────────────────────────────────────────────────────

export interface ModoDatePickerProps extends DatePickerProps {
    // 可按需扩展业务属性
}

/**
 * ModoDatePicker
 *
 * 基于 Ant Design DatePicker 封装，符合 MODO 设计规范：
 * - 默认 variant="filled"（填充模式，背景色 var(--color-fill-2) = #EFF4F9）
 * - 默认 suffixIcon 为 CalendarDuotone（三级文字色，14px）
 * - 继承 Ant Design DatePicker 的所有 Props
 *
 * @example
 * <ModoDatePicker format="YYYY-MM-DD" onChange={(date) => console.log(date)} />
 */
export const ModoDatePicker = React.forwardRef<any, ModoDatePickerProps>(
    ({ className, variant = 'filled', suffixIcon = DEFAULT_SUFFIX_ICON, ...props }, ref) => {
        return (
            <AntDatePicker
                ref={ref}
                variant={variant}
                suffixIcon={suffixIcon}
                className={classNames(styles['modo-date-picker'], className)}
                {...props}
            />
        );
    }
);

ModoDatePicker.displayName = 'ModoDatePicker';

// ─── ModoRangePicker ───────────────────────────────────────────────────────

export interface ModoRangePickerProps extends RangePickerProps {
    // 可按需扩展业务属性
}

/**
 * ModoRangePicker
 *
 * 基于 Ant Design RangePicker 封装，符合 MODO 设计规范：
 * - 默认 variant="filled"（填充模式，背景色 var(--color-fill-2) = #EFF4F9）
 * - 默认 suffixIcon 为 CalendarDuotone（三级文字色，14px）
 * - 默认 separator 为 SubtractDuotone（减号形，三级文字色，14px）
 * - 继承 Ant Design RangePicker 的所有 Props
 *
 * @example
 * <ModoRangePicker
 *   defaultValue={[dayjs('2024-01-01'), dayjs('2024-01-31')]}
 *   format="YYYY-MM-DD"
 *   onChange={(dates) => console.log(dates)}
 * />
 */
export const ModoRangePicker = React.forwardRef<any, ModoRangePickerProps>(
    ({ className, variant = 'filled', suffixIcon = DEFAULT_SUFFIX_ICON, separator = DEFAULT_SEPARATOR, ...props }, ref) => {
        return (
            <AntRangePicker
                ref={ref}
                variant={variant}
                suffixIcon={suffixIcon}
                separator={separator}
                className={classNames(styles['modo-date-picker'], className)}
                {...props}
            />
        );
    }
);

ModoRangePicker.displayName = 'ModoRangePicker';

export default ModoDatePicker;
