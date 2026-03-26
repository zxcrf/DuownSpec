'use client';

import React from 'react';
import { Form, Input, Checkbox, Button, Typography } from 'antd';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

/**
 * [Pattern: Login Page] (登录页模板)
 * 
 * 视觉规格（对标 MODO 最新登录页规范）：
 * - 左右双栏卡片布局
 * - 左栏：3D 科技装饰图
 * - 右栏：极简表单，下划线风格输入框
 * - 定制化：支持自定义应用名、Logo、封面图
 */
export default function LoginPage() {
    const router = useRouter();

    const onFinish = (values: any) => {
        console.log('Login Success:', values);
        // 示例：跳转回首页
        // router.push('/pages/dashboard');
    };

    // 配置项（实际使用时可作为 Props 抽离）
    const config = {
        logoSrc: '/logo.png',
        logoAlt: 'DataAtlas Logo',
        appName: 'Data Supply',
        welcomeText: 'Hello!',
        coverImage: '/login-cover.png', // 建议使用 8192px * 8192px 左右的 3D 渲染图
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F7FA] relative overflow-hidden font-sans">
            {/* 页面顶部 Logo */}
            <div className="absolute top-8 left-12 z-20">
                <img src={config.logoSrc} alt={config.logoAlt} className="h-[32px] w-auto object-contain" />
            </div>

            {/* 登录卡片容器 */}
            <div className="w-full max-w-[816px] h-[450px] bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex overflow-hidden z-10 mx-4">

                {/* 左栏：装饰图区域 */}
                <div className="hidden lg:flex w-[50%] bg-[#EAEEF6] relative items-center justify-center overflow-hidden">
                    <img
                        src={config.coverImage}
                        alt="Decorative Cover"
                        className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                    />
                    {/* 叠加一个微弱的渐变层，提升通透感 */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary-6/10 to-transparent pointer-events-none" />
                </div>

                {/* 右栏：表单区域 */}
                <div className="w-full lg:w-[50%] pt-[56px] px-[70px] pb-[65px] flex flex-col justify-start bg-white">
                    {/* 欢迎语 */}
                    <div className="mb-10 text-left">
                        <Title level={1} className="!mb-2 !font-semibold !text-[16px] !leading-none !text-text-1">{config.welcomeText}</Title>
                        <div className="flex items-baseline gap-2">
                            <Text className="text-text-3 text-[16px]">欢迎登录</Text>
                            <span className="text-primary-6 text-[24px] font-semibold tracking-tight">{config.appName}</span>
                        </div>
                    </div>

                    {/* 登录表单 */}
                    <Form
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                        requiredMark={false}
                        autoComplete="off"
                        className="login-form-custom"
                    >
                        <Form.Item
                            label={<span className="text-text-1 font-normal text-[16px]">账号名称</span>}
                            name="username"
                            className="!mb-5"
                            rules={[{ required: true, message: '请输入您的账号' }]}
                        >
                            <Input
                                placeholder="请输入账号"
                                className="!h-[30px] !text-[12px] !border-0 !border-b !border-[#dadfe6] !rounded-none !px-0 !py-1 focus:!border-primary-6 transition-all !shadow-none placeholder:text-text-4 bg-transparent"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-text-1 font-normal text-[16px] mt-2">登录密码</span>}
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password
                                placeholder="请输入密码"
                                className="!h-[30px] !text-[12px] !border-0 !border-b !border-[#dadfe6] !rounded-none !px-0 !py-1 focus:!border-primary-6 transition-all !shadow-none placeholder:text-text-4 bg-transparent"
                            />
                        </Form.Item>

                        <div className="flex justify-between items-center mb-5 mt-4">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox className="text-text-3 text-[14px]">记住密码</Checkbox>
                            </Form.Item>
                            {/* 预留找回密码链接 */}
                            {/* <a className="text-[14px] text-primary-6 hover:text-primary-5" href="#">忘记密码？</a> */}
                        </div>

                        <Form.Item className="!mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                className="h-[36px] !rounded-[18px] text-[12px] font-semibold !bg-primary-6 hover:!bg-primary-5 border-none shadow-lg shadow-primary-6/20 transition-all active:scale-95"
                            >
                                登 录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>

            {/* 全局背景装饰 */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-light-1/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />

            <style jsx global>{`
                .login-form-custom .ant-form-item-label {
                    height: 28px;
                    padding-bottom: 0 !important;
                }
                .login-form-custom .ant-form-item-label > label {
                    height: 28px;
                    line-height: 28px;
                }
                .login-form-custom .ant-input,
                .login-form-custom .ant-input-affix-wrapper {
                    border-bottom: none !important;
                    background: transparent !important;
                }
                .login-form-custom .ant-input:focus,
                .login-form-custom .ant-input-focused,
                .login-form-custom .ant-input-affix-wrapper:focus,
                .login-form-custom .ant-input-affix-wrapper-focused {
                    border-bottom: none !important;
                }
                .login-form-custom .ant-input-password-icon {
                    color: #79879C;
                }
            `}</style>
        </div>
    );
}
