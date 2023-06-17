import React from 'react';
import styled from 'styled-components';

import { MapSearchType } from 'shared/constants/types';

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
        &:hover {
            background-color: #c7f1ff;
        }
        &.selected {
            color: #f8f9fb;
            background-color: #237bff;
        }
    }
`;

interface NavbarData {
    searchType: MapSearchType;
}

interface NavbarProps {
    data: NavbarData;
    selectSearchType: (searchType: MapSearchType) => void;
}

export const Navbar = (props: NavbarProps) => {
    const selected = (value: MapSearchType) => (props.data.searchType === value ? 'selected' : '');

    return (
        <NavbarWrapper>
            <NavBtns>
                <li className={selected('place')} onClick={() => props.selectSearchType('place')}>
                    장소
                </li>
                <li className={selected('spatial')} onClick={() => props.selectSearchType('spatial')}>
                    공간
                </li>
            </NavBtns>
        </NavbarWrapper>
    );
};
