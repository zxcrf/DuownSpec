import React from 'react';
import { ModoContainer, ModoContainerProps } from '../modo-container';

export interface ModoPageProps extends Omit<ModoContainerProps, 'width' | 'height'> { }

export const ModoPage: React.FC<ModoPageProps> = (props) => {
    return (
        <ModoContainer width="100%" height="100%" {...props} />
    );
};
