import React from 'react';
import styled from 'styled-components';

import { Navbar } from 'app/component/Navbar';
import { Searchbar } from 'app/component/Searchbar';
import { MapViewer } from 'app/component/MapViewer';
import { LayerBox } from 'app/component/LayerBox';

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    min-height: 0;
`;

export const Main = () => {
    return (
        <Container>
            <Navbar />
            <Searchbar />
            <MapViewer />
            <LayerBox />
        </Container>
    );
};
