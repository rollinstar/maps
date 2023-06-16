import React, { useState } from 'react';
import styled from 'styled-components';

import { Coordinates } from 'shared/constants/types';

import { kakaoApis } from 'app/api/kakao.api';

const SearchWrapper = styled.div`
    width: 350px;
    min-height: 0;
    border-right: 1px var(--border-color) solid;
    padding: 10px;
`;

const SearchBox = styled.div`
    padding: 20px;
    height: 80px;
    border-bottom: 1px var(--divide-color) solid;
    display: flex;
    align-items: center;
`;

const SearchInput = styled.input.attrs((props) => ({
    type: 'text',
}))`
    border: 2px var(--border-color) solid;
    border-radius: 4px;
    flex-grow: 1;
    height: 45px;
    font-size: 15px;
    color: #4a5568;
    padding: 0 10px;
`;

const ResultList = styled.div`
    padding: 10px;
`;

const Places = styled.ul`
    margin-top: 20px;
    li:first-child {
        border-top: 1px var(--divide-color) solid;
    }
    li {
        cursor: pointer;
        border-bottom: 1px var(--divide-color) solid;
        height: 30px;
        padding: 20px;
        font-size: 0.8rem;
        font-weight: var(--text-weight-regular);
        letter-spacing: 0.06em;
        color: #237bff;
        display: flex;
        align-items: center;
        &:hover {
            background-color: #edf2f7;
        }
    }
`;

interface PlaceListType {
    address_name: string;
    category_group_code: string;
    category_group_name: string;
    category_name: string;
    distance: string;
    id: string;
    phone: string;
    place_name: string;
    place_url: string;
    road_address_name: string;
    x: string;
    y: string;
}

interface PlaceSearchProps {
    moveToCenter: (coords: Coordinates) => void;
}

export const PlaceSearch = (props: PlaceSearchProps) => {
    const [placeList, setPlaceList] = useState<PlaceListType[]>();

    return (
        <SearchWrapper>
            <h2>장소 검색</h2>
            <SearchBox>
                <SearchInput
                    onKeyUp={async (e: React.KeyboardEvent<object>) => {
                        e.preventDefault();
                        if (e.key.toLowerCase() !== 'enter') return;
                        try {
                            const params = { query: (e.target as HTMLTextAreaElement).value };
                            if (!params.query) return;
                            const { data } = await kakaoApis.placeSearch(params);
                            const { documents } = data;
                            setPlaceList(documents);
                        } catch (error) {
                            console.error(error);
                        }
                    }}
                />
            </SearchBox>
            <ResultList>
                <h3>검색 결과</h3>
                {!placeList || (
                    <Places>
                        {placeList?.map(({ place_name: PlaceName, id, x, y }) => {
                            return (
                                <li
                                    key={id}
                                    onClick={() => {
                                        const coords = { lon: Number(x), lat: Number(y) };
                                        props.moveToCenter(coords);
                                    }}
                                >
                                    {PlaceName}
                                </li>
                            );
                        })}
                    </Places>
                )}
            </ResultList>
        </SearchWrapper>
    );
};
