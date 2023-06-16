import React from 'react';
import styled from 'styled-components';

const TextFieldRoot = styled.div`
    margin: 8px;
    display: inline-flex;
    align-items: center;
`;

const TextFieldLabel = styled.label`
    color: #2d3748;
    font-width: var(--text-weight-regular);
    line-height: 16px;
    font-size: 12px;
    margin-right: 15px;
    min-width: 65px;
`;

const TextFieldBase = styled.div`
    flex: 0 0 50%;
    border: 1px #2d3748 solid;
    border-radius: 5px;
`;

const InputText = styled.input.attrs((props) => ({
    type: 'text',
}))`
    width: 100%;
    height: 100%;
    border: 0;
    padding: 10px;
    background-color: transparent;
`;

interface UIStyleOptions {
    label?: string;
}
export const TextField = (props: UIStyleOptions) => {
    return (
        <TextFieldRoot>
            {!props.label || <TextFieldLabel>{props.label}</TextFieldLabel>}
            <TextFieldBase>
                <InputText />
            </TextFieldBase>
        </TextFieldRoot>
    );
};
