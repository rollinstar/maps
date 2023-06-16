import React from 'react';
import styled from 'styled-components';

const SearchWrapper = styled.div`
    width: 350px;
    min-height: 0;
    border-right: 1px var(--border-color) solid;
    padding: 10px;
`;

export const SpatialSearch = () => {
    return (
        <SearchWrapper>
            <h2>공간 검색</h2>
        </SearchWrapper>
    );
};
