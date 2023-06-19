import React, { useState } from 'react';
import styled from 'styled-components';

import { Navbar } from 'app/component/Navbar';
import { PlaceSearch } from 'app/component/PlaceSearch';
import { SpatialSearch } from 'app/component/SpatialSearch';
import { MapViewer } from 'app/component/MapViewer';

import { MapSearchType, Coordinates } from 'shared/constants/types';

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    min-height: 0;
`;

export const Main = () => {
    const [mapSearchType, setMapSearchType] = useState<MapSearchType>('place');
    const [movedCenter, setMovedCenter] = useState<Coordinates>();
    const [clickedCoord, setClickedCoord] = useState<Coordinates>();
    const [bufferSize, setBufferSize] = useState(500);
    const [schoolCoords, setScoolCoords] = useState<Coordinates[]>();

    const searchComponent =
        mapSearchType === 'place' ? (
            <PlaceSearch moveToCenter={(coords: Coordinates) => setMovedCenter(coords)} />
        ) : (
            <SpatialSearch
                data={{ clickedCoord }}
                bufferSize={(size: number) => setBufferSize(size)}
                schoolCoords={(coords: Coordinates[]) => setScoolCoords(coords)}
            />
        );

    return (
        <Container>
            <Navbar
                data={{ searchType: mapSearchType }}
                selectSearchType={(searchType: MapSearchType) => setMapSearchType(searchType)}
            />
            {searchComponent}
            <MapViewer
                data={{ movedCenter, searchType: mapSearchType, bufferSize, clickedCoord, schoolCoords }}
                clickedPostion={(coords: Coordinates) => setClickedCoord(coords)}
            />
        </Container>
    );
};
