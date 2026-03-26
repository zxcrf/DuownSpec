'use client';

import React, { useState } from 'react';
import { Form, Radio, Row, Col } from 'antd';
import { ModoInput, ModoTextArea } from '@/components/biz/modo-input';
import { ModoSelect } from '@/components/biz/modo-select';
import { ModoButton } from '@/components/biz/modo-button';
import { ModoPage } from '@/components/biz/modo-page';
import { ModoSteps } from '@/components/biz/modo-steps';
import { QuestionDuotone } from 'modo-icon';

// ─── 步骤定义 ─────────────────────────────────────────────────────────────────

const STEPS = [
    { title: '基本信息配置' },
    { title: '技术信息配置' },
    { title: '业务信息配置' },
    { title: '调度信息配置' },
    { title: '配置完成' },
];

/**
 * Step1Content - 基本信息配置
 * 使用 Ant Design 原生 Form 和 Row/Col 组件进行布局，避免自定义辅助组件
 */
function Step1Content() {
    const [aggType, setAggType] = useState<string>('half');

    return (
        <Form
            layout="horizontal"
            labelAlign="right"
            labelCol={{ flex: '0 0 100px' }} // 略微加宽 label 区域以适应 MODO 风格
            wrapperCol={{ flex: '1 1 0' }}
            colon={false} // 移除冒号
            className="modo-form"
        >
            {/* ── 基础信息 ── */}
            <div className="flex items-center gap-[4px] mb-[10px]">
                <div className="w-[3px] h-[10px] bg-modo-6 rounded-[3px]" />
                <span className="text-[12px] font-medium text-text-1">基础信息</span>
            </div>

            <Row gutter={40}>
                {/* 指标名称 */}
                <Col span={12}>
                    <Form.Item label="指标名称" required>
                        <ModoInput defaultValue="当日全球通硬合约办理量" />
                    </Form.Item>
                </Col>
                {/* 指标类型 */}
                <Col span={12}>
                    <Form.Item label="指标类型" required>
                        <ModoSelect
                            placeholder="派生指标"
                            className="w-full"
                            options={[
                                { label: '派生指标', value: 'derived' },
                                { label: '原子指标', value: 'atomic' },
                            ]}
                        />
                    </Form.Item>
                </Col>

                {/* 指标编码 */}
                <Col span={12}>
                    <Form.Item label="指标编码" required>
                        <ModoInput defaultValue="ATO251205LHYW" disabled />
                    </Form.Item>
                </Col>
                {/* 所属目录 */}
                <Col span={12}>
                    <Form.Item label="所属目录" required>
                        <ModoSelect
                            defaultValue="new_growth"
                            className="w-full"
                            options={[
                                { label: '新增发展', value: 'new_growth' },
                                { label: '存量运营', value: 'stock_ops' },
                            ]}
                        />
                    </Form.Item>
                </Col>

                {/* 存储类型 */}
                <Col span={12}>
                    <Form.Item label="存储类型" required>
                        <ModoSelect
                            defaultValue="physical"
                            className="w-full"
                            options={[
                                { label: '物理存储', value: 'physical' },
                                { label: '逻辑存储', value: 'logical' },
                            ]}
                        />
                    </Form.Item>
                </Col>
                {/* 聚合类型 */}
                <Col span={12}>
                    <Form.Item
                        label="聚合类型"
                        required
                        tooltip={{
                            title: "聚合类型的说明文字",
                            icon: <span className="text-[14px] text-text-2"><QuestionDuotone /></span>
                        }}
                    >
                        <div className="flex items-center gap-[8px] flex-wrap">
                            <div className="flex items-center gap-[4px] mr-[8px]">
                                <Radio.Group
                                    value={aggType}
                                    onChange={(e) => setAggType(e.target.value)}
                                    className="flex items-center gap-[8px]"
                                >
                                    <Radio value="full">完全可加</Radio>
                                    <Radio value="half">半可加</Radio>
                                    <Radio value="none">不可加</Radio>
                                </Radio.Group>
                            </div>
                            <ModoSelect
                                placeholder="请选择聚合函数"
                                className="flex-1 min-w-[120px]"
                                defaultValue={aggType === 'half' ? 'sum' : undefined}
                                disabled={aggType === 'none'}
                                options={[
                                    { label: 'SUM', value: 'sum' },
                                    { label: 'AVG', value: 'avg' },
                                    { label: 'MAX', value: 'max' },
                                    { label: 'MIN', value: 'min' },
                                ]}
                            />
                        </div>
                    </Form.Item>
                </Col>

                {/* 指标类型 (重复) */}
                <Col span={12}>
                    <Form.Item label="指标类型" required>
                        <ModoSelect
                            defaultValue="count"
                            className="w-full"
                            options={[
                                { label: '数量类', value: 'count' },
                                { label: '比率类', value: 'ratio' },
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col span={12} />

                {/* 业务口径 (全宽) */}
                <Col span={24}>
                    <Form.Item label="业务口径">
                        <ModoTextArea
                            placeholder="请输入..."
                            rows={3}
                            maxLength={50}
                            showCount
                        />
                    </Form.Item>
                </Col>

                {/* 描述信息 (全宽) */}
                <Col span={24}>
                    <Form.Item label="描述信息">
                        <ModoTextArea
                            placeholder="请输入..."
                            rows={3}
                            maxLength={50}
                            showCount
                        />
                    </Form.Item>
                </Col>
            </Row>

            {/* ── 管理属性 ── */}
            <div className="flex items-center gap-[4px] mb-[10px]">
                <div className="w-[3px] h-[10px] bg-modo-6 rounded-[3px]" />
                <span className="text-[12px] font-medium text-text-1">管理属性</span>
            </div>

            <Row gutter={40}>
                {/* 管理部门 | 管理人员 */}
                <Col span={12}>
                    <Form.Item label="管理部门">
                        <ModoInput placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="管理人员">
                        <ModoInput placeholder="请输入" />
                    </Form.Item>
                </Col>

                {/* 需求部门 | 需求人员 */}
                <Col span={12}>
                    <Form.Item label="需求部门">
                        <ModoInput placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="需求人员">
                        <ModoInput placeholder="请输入" />
                    </Form.Item>
                </Col>

                {/* 开发部门 | 开发人员 */}
                <Col span={12}>
                    <Form.Item label="开发部门">
                        <ModoInput placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="开发人员">
                        <ModoInput placeholder="请输入" />
                    </Form.Item>
                </Col>

                {/* 指标来源系统 */}
                <Col span={12}>
                    <Form.Item label="指标来源系统" required>
                        <ModoInput defaultValue="政企商机管理系统" />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}

// ─── 占位步骤内容 ─────────────────────────────────────────────────────────────

function PlaceholderStep({ title }: { title: string }) {
    return (
        <div className="flex items-center justify-center h-[320px] text-text-3 text-[14px]">
            {title} — 内容待填充
        </div>
    );
}

// ─── 完成步骤 ─────────────────────────────────────────────────────────────────

function FinishStep() {
    return (
        <div className="flex flex-col items-center justify-center h-[320px] gap-[16px]">
            <div className="w-[64px] h-[64px] rounded-full bg-modo-1 flex items-center justify-center">
                <span className="text-[28px] text-modo-6">✓</span>
            </div>
            <span className="text-[16px] font-semibold text-text-1">配置已完成</span>
            <span className="text-[13px] text-text-3">指标已成功创建，可在指标列表中查看</span>
        </div>
    );
}

// ─── 主页面 ───────────────────────────────────────────────────────────────────

export default function WizardTemplatePage() {
    const [current, setCurrent] = useState(0);

    const stepContents = [
        <Step1Content key="step1" />,
        <PlaceholderStep key="step2" title="技术信息配置" />,
        <PlaceholderStep key="step3" title="业务信息配置" />,
        <PlaceholderStep key="step4" title="调度信息配置" />,
        <FinishStep key="step5" />,
    ];

    const isLast = current === STEPS.length - 1;

    return (
        <ModoPage className="!p-0" contentClassName="!shadow-none !rounded-none">
            {/* 步骤条：固定在顶部 */}
            <div className="shrink-0 bg-fill-1 px-[32px] h-[64px] flex items-center justify-center border-b border-border-1">
                <ModoSteps
                    current={current}
                    items={STEPS}
                    size="default"
                    className="max-w-[900px] w-full"
                />
            </div>

            {/* 表单内容区：独立滚动 */}
            <div className="flex-1 overflow-y-auto min-h-0 px-[20px] py-[16px]">
                <div className="bg-white rounded-sm p-0 mb-[40px]">
                    {stepContents[current]}
                </div>
            </div>

            {/* 底部悬浮操作栏 */}
            <div className="shrink-0 h-[44px] bg-white border-t border-border-1 flex items-center justify-end gap-[8px] px-[24px]">
                <ModoButton onClick={() => setCurrent(0)}>取消</ModoButton>
                {current > 0 && (
                    <ModoButton onClick={() => setCurrent((c) => Math.max(c - 1, 0))}>
                        上一步
                    </ModoButton>
                )}
                {!isLast && (
                    <ModoButton type="primary">
                        保存
                    </ModoButton>
                )}
                {!isLast ? (
                    <ModoButton
                        type="primary"
                        onClick={() => setCurrent((c) => Math.min(c + 1, STEPS.length - 1))}
                    >
                        下一步
                    </ModoButton>
                ) : (
                    <ModoButton type="primary" onClick={() => setCurrent(0)}>
                        返回列表
                    </ModoButton>
                )}
            </div>
        </ModoPage>
    );
}
