import React from 'react';
import styled from 'styled-components';

const NavbarWrapper = styled.div`
    width: 56px;
    min-height: 0;
    border-right: 1px var(--border-color) solid;
    display: flex;
    flex-direction: column;
`;

const NavBtns = styled.ul`
    flex: 1;
    li {
        cursor: pointer;
        height: 54px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px var(--border-color) solid;
        font-size: 0.8rem;
        font-weight: var(--text-weight-regular);
        line-height: 1.75;
        letter-spacing: 0.1em;
        color: #4a5568;
        :hover {
            background-color: #c7f1ff;
        }
        &.selected {
            color: #f8f9fb;
            background-color: #237bff;
        }
    }
`;

export const Navbar = () => {
    return (
        <NavbarWrapper>
            <NavBtns>
                <li>장소</li>
                <li>공간</li>
            </NavBtns>
        </NavbarWrapper>
    );
};
