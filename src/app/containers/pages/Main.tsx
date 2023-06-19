import React, { useEffect, useState } from 'react';
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
    const [searchType, setMapSearchType] = useState<MapSearchType>('place');
    const [movedCenter, setMovedCenter] = useState<Coordinates>();
    const [clickedCoord, setClickedCoord] = useState<Coordinates | undefined>();
    const [bufferSize, setBufferSize] = useState(500);
    const [schoolCoords, setScoolCoords] = useState<Coordinates[]>();

    useEffect(() => {
        if (searchType === 'place') {
            setClickedCoord(undefined);
            setBufferSize(500);
        }
    }, [searchType]);

    const searchComponent =
        searchType === 'place' ? (
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
                data={{ searchType: searchType }}
                selectSearchType={(searchType: MapSearchType) => setMapSearchType(searchType)}
            />
            {searchComponent}
            <MapViewer
                data={{ movedCenter, searchType, bufferSize, clickedCoord, schoolCoords }}
                clickedPostion={(coords: Coordinates) => setClickedCoord(coords)}
            />
        </Container>
    );
};
