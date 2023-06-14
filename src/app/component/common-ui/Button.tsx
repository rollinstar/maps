import React, { HTMLProps, MouseEventHandler } from 'react';
import styled from 'styled-components';

export const ButtonStyle = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border-radius: 4px;
    border: 0;
    margin: 0;
    user-select: none;
    font-size: 0.8rem;
    font-weight: 500;
    line-height: 1.7;
    letter-spacing: 0.02em;
    min-width: 65px;
    padding: 6px 8px;
    color: var(--primary-color);
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}
    &.contained {
        background-color: var(--primary-color);
        color: #edf2f7;
        box-shadow: rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px,
            rgb(0 0 0 / 12%) 0px 1px 5px 0px;
    }
    &.outlined {
        border: 1px var(--primary-color) solid;
        box-shadow: rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px,
            rgb(0 0 0 / 12%) 0px 1px 5px 0px;
    }
    &.small {
      font-size: 0.6rem;
    }
    &.large {
      font-size: 0.9rem;
    }
    
    &:disabled {
        background-color: var(--disabled-color);
    }
`;

type ButtonVariant = 'text' | 'contained' | 'outlined';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonStyleProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children?: string;
    onClick?: MouseEventHandler;
}

export const Button = (props: ButtonStyleProps) => {
    const classes = [];
    const { variant, size, children } = props;
    if (variant) classes.push(variant);
    if (size) classes.push(size);

    return (
        <ButtonStyle className={classes.join(' ')} onClick={props.onClick}>
            {children}
        </ButtonStyle>
    );
};
