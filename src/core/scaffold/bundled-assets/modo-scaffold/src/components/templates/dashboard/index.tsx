'use client';

import React from 'react';
import { ModoRangePicker } from '@/components/biz/modo-date-picker';
import { ModoTable } from '@/components/biz/modo-table';
import dayjs from 'dayjs';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import {
    DocumentDuotone,
    ScissorsDuotone,
    MessageDuotone,
    HeartDuotone,
    FolderDuotone,
    MagnifierDuotone,
    ApiDuotone,
    StarDuotone,
} from 'modo-icon';

// ─────────────────────────────────────────────────────────────────────────────
// ① Mock Data — 替换为真实 API 数据
// ─────────────────────────────────────────────────────────────────────────────

const teams = ['团队A', '团队B', '团队C', '团队D', '团队E', '团队F'];

const teamKnowledgeData = teams.map((name, i) => ({ name, value: [380, 800, 210, 540, 120, 290][i] }));
const teamSliceData = teams.map((name, i) => ({ name, value: [520, 400, 90, 470, 300, 390][i] }));
const qaData = teams.map((name, i) => ({ name, value: [320, 100, 260, 110, 80, 40][i] }));
const likeData = teams.map((name, i) => ({ name, value: [440, 80, 120, 200, 100, 60][i] }));
const kbCallData = teams.map((name, i) => ({ name, value: [950, 120, 180, 140, 100, 90][i] }));
const ksCallData = teams.map((name, i) => ({ name, value: [740, 380, 280, 540, 310, 200][i] }));
const apiCallData = teams.map((name, i) => ({ name, value: [820, 140, 340, 180, 80, 50][i] }));

const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];
const userTrendData = hours.map((h, i) => ({
    time: h,
    用户登录: [160, 180, 200, 230, 190, 170, 155][i],
    登录访问: [40, 48, 56, 60, 52, 48, 38][i],
}));
const platformTrendData = hours.map((h, i) => ({
    time: h,
    登录用户: [160, 180, 200, 230, 190, 170, 155][i],
    知识上传用户: [30, 40, 50, 55, 48, 42, 35][i],
    知识访问用户: [50, 60, 75, 80, 70, 65, 55][i],
}));

/** TOP N 排行数据结构 */
interface RankItem {
    rank: number;
    name: string;
    dept: string;
    calls: number;
}
const top5Data: RankItem[] = [
    { rank: 1, name: '知识文档 A', dept: '部门 / 子部门', calls: 25023 },
    { rank: 2, name: '知识文档 B', dept: '部门 / 子部门', calls: 4836 },
    { rank: 3, name: '知识文档 C', dept: '部门 / 子部门', calls: 2131 },
    { rank: 4, name: '知识文档 D', dept: '部门 / 子部门', calls: 795 },
    { rank: 5, name: '知识文档 E', dept: '部门 / 子部门', calls: 622 },
];

// ─────────────────────────────────────────────────────────────────────────────
// ② Design System Color Tokens (MODO globals.css → JS)
//    Recharts 只接受字符串/具体色值，不支持 CSS var()，故在此显式声明
// ─────────────────────────────────────────────────────────────────────────────

const BLUE = '#3261CE'; // --color-modo-6      品牌蓝
const TEAL = '#35C9C0'; // --color-cyan-6       青色
const PURPLE = '#724BC5'; // --color-purple-6     紫色
const ORANGE = '#E2682F'; // --color-orangered-6  橙红
const GREEN = '#55BC8A'; // --color-green-6      绿色

/** 坐标轴刻度文字样式 */
const axisStyle = { fontSize: 11, fill: 'var(--color-text-3)' };
/** Tooltip 容器样式 */
const tooltipStyle = { fontSize: 12, borderRadius: 4, border: '1px solid var(--color-border-1)' };

// ─────────────────────────────────────────────────────────────────────────────
// ③ 子组件
// ─────────────────────────────────────────────────────────────────────────────

// ── StatCard ──────────────────────────────────────────────────────────────────

interface StatCardProps {
    icon: React.ReactNode;
    /** Tailwind bg 类，如 "bg-modo-1" */
    iconBg: string;
    label: string;
    value: string | number;
    unit: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, iconBg, label, value, unit }) => (
    <div className="bg-white rounded-sm flex items-center gap-[12px] px-[16px] py-[14px]">
        <div className={`w-[42px] h-[42px] rounded-[8px] flex items-center justify-center text-[20px] shrink-0 ${iconBg}`}>
            {icon}
        </div>
        <div className="flex flex-col min-w-0">
            <span className="text-[14px] text-text-1 leading-[22px]">{label}</span>
            <div className="flex items-baseline gap-[4px] mt-[4px]">
                <span className="text-[24px] font-semibold text-text-1 leading-[32px]">{value.toLocaleString()}</span>
                <span className="text-[14px] text-text-3 leading-[28px]">{unit}</span>
            </div>
        </div>
    </div>
);

// ── ChartCard ─────────────────────────────────────────────────────────────────

interface ChartCardProps {
    title: string;
    /** 显示日期范围选择器 */
    dateRange?: boolean;
    children: React.ReactNode;
    /** 并排布局（flex-1，固定 300px 高） */
    half?: boolean;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, dateRange = false, children, half = false }) => {
    const defaultRange: [dayjs.Dayjs, dayjs.Dayjs] = [dayjs().subtract(26, 'day'), dayjs()];
    return (
        <div className={`bg-white rounded-sm flex flex-col ${half ? 'flex-1 min-w-0 h-[300px]' : 'w-full'}`}>
            <div className="flex items-center justify-between m-[16px] h-[28px] shrink-0">
                <span className="text-[14px] font-semibold text-text-1">{title}</span>
                {dateRange && (
                    <ModoRangePicker
                        defaultValue={defaultRange}
                        format="YYYY-MM-DD"
                    />
                )}
            </div>
            <div className="flex-1 min-h-0 px-[8px] pb-[12px]">
                {children}
            </div>
        </div>
    );
};

// ── SimpleBar — 通用单色柱状图 ────────────────────────────────────────────────

function SimpleBar({ data, color }: { data: { name: string; value: number }[]; color: string }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={18}>
                <CartesianGrid vertical={false} stroke="var(--color-border-2)" strokeDasharray="4 4" />
                <XAxis
                    dataKey="name"
                    tick={axisStyle}
                    interval={0}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--color-border-2)' }}
                    tickFormatter={(v: string) => v.length > 5 ? v.slice(0, 5) + '…' : v}
                />
                <YAxis tick={axisStyle} tickLine={false} axisLine={{ stroke: 'var(--color-border-2)' }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-fill-1)' }} />
                <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

// ── RankBadge — 金银铜及普通排名徽章 ─────────────────────────────────────────

const RANK_COLORS = [
    'var(--color-orange-6)',  // 金 #F5A623
    'var(--color-gray-5)',    // 银 #95A6BA
    'var(--color-orange-7)',  // 铜 #CB7F16
];

const RankBadge = ({ rank }: { rank: number }) => {
    if (rank <= 3) {
        return (
            <div
                className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: RANK_COLORS[rank - 1] }}
            >
                {rank}
            </div>
        );
    }
    return <span className="text-[12px] text-text-3 w-[20px] text-center">{rank}</span>;
};

// ─────────────────────────────────────────────────────────────────────────────
// ④ 主页面
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    return (
        <div className="w-full h-full overflow-y-auto bg-fill-2">
            <div className="flex flex-col gap-[10px] p-[12px]">

                {/* ── 统计卡片区（2 行 × 4 列）── */}
                <div className="grid grid-cols-4 gap-[10px]">
                    {/* 第一行：核心数量指标 */}
                    <StatCard icon={<DocumentDuotone className="text-modo-6" />} iconBg="bg-modo-1" label="知识文件总数" value={698} unit="个" />
                    <StatCard icon={<ScissorsDuotone className="text-cyan-6" />} iconBg="bg-cyan-1" label="切片总数" value={825} unit="个" />
                    <StatCard icon={<MessageDuotone className="text-purple-6" />} iconBg="bg-purple-1" label="问答数" value={103} unit="个" />
                    <StatCard icon={<HeartDuotone className="text-orangered-6" />} iconBg="bg-orangered-1" label="点赞数" value={152} unit="个" />
                </div>
                <div className="grid grid-cols-4 gap-[10px]">
                    {/* 第二行：调用 & 评价指标 */}
                    <StatCard icon={<FolderDuotone className="text-modo-6" />} iconBg="bg-modo-1" label="知识集数量" value={77} unit="个" />
                    <StatCard icon={<MagnifierDuotone className="text-cyan-6" />} iconBg="bg-cyan-1" label="知识调用" value={9625} unit="次" />
                    <StatCard icon={<ApiDuotone className="text-purple-6" />} iconBg="bg-purple-1" label="API数量" value={36} unit="个" />
                    <StatCard icon={<StarDuotone className="text-orange-6" />} iconBg="bg-orange-1" label="好评率" value="97.5" unit="%" />
                </div>

                {/* ── 柱状图区（按需增减区块）── */}
                <div className="flex gap-[10px]">
                    <ChartCard title="团队知识分布" half>
                        <SimpleBar data={teamKnowledgeData} color={BLUE} />
                    </ChartCard>
                    <ChartCard title="切片数量统计" half>
                        <SimpleBar data={teamSliceData} color={TEAL} />
                    </ChartCard>
                </div>

                <div className="flex gap-[10px]">
                    <ChartCard title="问答数量统计" dateRange half>
                        <SimpleBar data={qaData} color={PURPLE} />
                    </ChartCard>
                    <ChartCard title="点赞数量统计" dateRange half>
                        <SimpleBar data={likeData} color={ORANGE} />
                    </ChartCard>
                </div>

                <div className="flex gap-[10px]">
                    <ChartCard title="知识库调用统计" dateRange half>
                        <SimpleBar data={kbCallData} color={BLUE} />
                    </ChartCard>
                    <ChartCard title="知识集调用统计" dateRange half>
                        <SimpleBar data={ksCallData} color={TEAL} />
                    </ChartCard>
                </div>

                {/* ── TOP N 排行 + 图表并排区 ── */}
                <div className="flex gap-[10px]">
                    {/* TOP5 表格卡片 */}
                    <div className="bg-white rounded-sm border border-border-1 flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center justify-between m-[16px] h-[28px] shrink-0">
                            <span className="text-[14px] font-semibold text-text-1">热门知识 TOP5</span>
                            <ModoRangePicker
                                defaultValue={[dayjs().subtract(26, 'day'), dayjs()]}
                                format="YYYY-MM-DD"
                            />
                        </div>
                        <ModoTable<RankItem>
                            dataSource={top5Data}
                            rowKey="rank"
                            size="small"
                            scroll={{ x: undefined, y: undefined }}
                            columns={[
                                {
                                    title: '排名',
                                    dataIndex: 'rank',
                                    width: 48,
                                    align: 'center',
                                    render: (rank: number) => (
                                        <div className="flex items-center justify-center">
                                            <RankBadge rank={rank} />
                                        </div>
                                    ),
                                },
                                {
                                    title: '知识名称',
                                    dataIndex: 'name',
                                    ellipsis: true,
                                    render: (name: string) => <span className="text-text-1">{name}</span>,
                                },
                                {
                                    title: '所属部门',
                                    dataIndex: 'dept',
                                    ellipsis: true,
                                    render: (dept: string) => <span className="text-text-3">{dept}</span>,
                                },
                                {
                                    title: '调用次数',
                                    dataIndex: 'calls',
                                    width: 82,
                                    align: 'left',
                                    sorter: (a: RankItem, b: RankItem) => a.calls - b.calls,
                                    render: (calls: number) => (
                                        <span className="font-medium text-text-1">{calls.toLocaleString()}</span>
                                    ),
                                },
                            ]}
                        />
                    </div>

                    {/* 右侧图表 */}
                    <ChartCard title="API调用统计" dateRange half>
                        <SimpleBar data={apiCallData} color={TEAL} />
                    </ChartCard>
                </div>

                {/* ── 折线趋势图区（外部自定义图例，避免 Recharts 内部布局限制）── */}
                <div className="flex gap-[10px]">
                    <ChartCard title="用户使用情况" dateRange half>
                        <div className="flex flex-col h-full">
                            {/* 自定义图例 — 用 mb 控制与折线之间的精确间距 */}
                            <div className="flex items-center justify-center gap-[16px] text-[11px] text-text-2 mb-[12px] shrink-0">
                                <span className="flex items-center gap-[4px]">
                                    <span className="inline-block w-[8px] h-[8px] rounded-full" style={{ background: BLUE }} />
                                    用户登录
                                </span>
                                <span className="flex items-center gap-[4px]">
                                    <span className="inline-block w-[8px] h-[8px] rounded-full" style={{ background: GREEN }} />
                                    登录访问
                                </span>
                            </div>
                            <div className="flex-1 min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={userTrendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                                        <CartesianGrid vertical={false} stroke="var(--color-border-2)" strokeDasharray="4 4" />
                                        <XAxis dataKey="time" tick={axisStyle} tickLine={false} axisLine={{ stroke: 'var(--color-border-2)' }} />
                                        <YAxis tick={axisStyle} tickLine={false} axisLine={{ stroke: 'var(--color-border-2)' }} />
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Line type="monotone" dataKey="用户登录" stroke={BLUE} strokeWidth={2} dot={{ r: 3, fill: BLUE, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                                        <Line type="monotone" dataKey="登录访问" stroke={GREEN} strokeWidth={2} dot={{ r: 3, fill: GREEN, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </ChartCard>

                    <ChartCard title="平台使用情况" dateRange half>
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-center gap-[16px] text-[11px] text-text-2 mb-[12px] shrink-0">
                                <span className="flex items-center gap-[4px]">
                                    <span className="inline-block w-[8px] h-[8px] rounded-full" style={{ background: BLUE }} />
                                    登录用户
                                </span>
                                <span className="flex items-center gap-[4px]">
                                    <span className="inline-block w-[8px] h-[8px] rounded-full" style={{ background: ORANGE }} />
                                    知识上传用户
                                </span>
                                <span className="flex items-center gap-[4px]">
                                    <span className="inline-block w-[8px] h-[8px] rounded-full" style={{ background: GREEN }} />
                                    知识访问用户
                                </span>
                            </div>
                            <div className="flex-1 min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={platformTrendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                                        <CartesianGrid vertical={false} stroke="var(--color-border-2)" strokeDasharray="4 4" />
                                        <XAxis dataKey="time" tick={axisStyle} tickLine={false} axisLine={{ stroke: 'var(--color-border-2)' }} />
                                        <YAxis tick={axisStyle} tickLine={false} axisLine={{ stroke: 'var(--color-border-2)' }} />
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Line type="monotone" dataKey="登录用户" stroke={BLUE} strokeWidth={2} dot={{ r: 3, fill: BLUE, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                                        <Line type="monotone" dataKey="知识上传用户" stroke={ORANGE} strokeWidth={2} dot={{ r: 3, fill: ORANGE, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                                        <Line type="monotone" dataKey="知识访问用户" stroke={GREEN} strokeWidth={2} dot={{ r: 3, fill: GREEN, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </ChartCard>
                </div>

            </div>
        </div>
    );
}
