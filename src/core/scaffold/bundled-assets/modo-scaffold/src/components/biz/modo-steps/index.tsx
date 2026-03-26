import React from 'react';
import { Steps, StepsProps } from 'antd';
import classNames from 'classnames';
import styles from './modo-steps.module.css';

export type ModoStepsProps = StepsProps;

export const ModoSteps: React.FC<ModoStepsProps> = ({ className, ...props }) => {
    return (
        <Steps
            className={classNames(styles['modo-steps'], className)}
            {...props}
        />
    );
};
