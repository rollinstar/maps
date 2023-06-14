import React from 'react';
import styled from 'styled-components';

const SearchbarWrapper = styled.div`
    width: 350px;
    min-height: 0;
    border-right: 1px var(--border-color) solid;
    padding: 10px;
`;

export const Searchbar = () => {
    return (
        <SearchbarWrapper>
            <h2>장소 검색</h2>
        </SearchbarWrapper>
    );
};
