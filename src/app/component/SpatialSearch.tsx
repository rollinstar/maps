import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from 'app/component/common-ui/index';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import { transform } from 'ol/proj';
import { kakaoApis, CategorySearchParamType, CategorySearchResultDocumentType } from 'app/api/kakao.api';
import { Coordinates, PlaceListType } from 'shared/constants/types';
import { pieChartBackgroundColors, pieChartBorderColors } from 'shared/constants/common';

ChartJS.register(ArcElement, Tooltip, Legend);

const SearchWrapper = styled.div`
    width: 350px;
    min-height: 0;
    border-right: 1px var(--border-color) solid;
    padding: 10px;
`;

const SearchBox = styled.div`
    padding: 20px;
    border-bottom: 1px var(--divide-color) solid;
    display: flex;
    flex-direction: column;
    p {
        font-size: 0.8rem;
        margin-bottom: 4px;
        padding: 4px 0px;
    }
`;

const BufferSize = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0px;
    gap: 8px;
    font-size: 0.8rem;
    padding: 4px 0px;
`;

const SearchInput = styled.input.attrs(() => ({
    type: 'Number',
}))`
    border: 2px var(--divide-color) solid;
    border-radius: 4px;
    flex-grow: 1;
    height: 45px;
    font-size: 15px;
    color: #4a5568;
    padding: 0 10px;
    outline: none;
`;

const ResultList = styled.div`
    padding: 10px;
    overflow:scroll; height:350px;"
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

interface SpatialSearchData {
    clickedCoord?: Coordinates;
}

interface SpatialSearchProps {
    data: SpatialSearchData;
    bufferSize: (size: number) => void;
    schoolCoords: (coords: Coordinates[]) => void;
}

interface PieChartDataType {
    labels: string[];
    datasets: {
        label?: string;
        data: number[];
        backgroundColor?: string[];
        borderColor?: string[];
        borderWidth?: number;
    }[];
}

export const SpatialSearch = (props: SpatialSearchProps) => {
    const [bufferRadius, setBufferRadius] = useState(500);
    const [placeList, setPlaceList] = useState<PlaceListType[]>();
    const [pieChart, setPieChart] = useState<PieChartDataType>({ labels: [], datasets: [{ data: [] }] });
    const [clickedPostion, setClickedPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        return () => {
            setBufferRadius(500);
            setClickedPosition({ x: 0, y: 0 });
        };
    }, []);

    useEffect(() => {
        if (!props.data.clickedCoord) return;
        const { lat, lon } = props.data.clickedCoord;
        const [x, y] = transform([lat, lon], 'EPSG:3857', 'EPSG:4326');
        setClickedPosition({ x, y });
    }, [props.data.clickedCoord]);

    return (
        <SearchWrapper>
            <h2>공간&#40;학교&#41; 검색</h2>
            <SearchBox>
                <p>
                    <span>위도&nbsp;:&nbsp;</span>
                    <span>{clickedPostion.y || ''}</span>
                </p>
                <p>
                    <span>경도&nbsp;:&nbsp;</span>
                    <span>{clickedPostion.x || ''}</span>
                </p>
                <BufferSize>
                    <label>거리</label>
                    <SearchInput
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            setBufferRadius(value);
                            props.bufferSize(value);
                        }}
                    />
                    <span>m</span>
                </BufferSize>
                <Button
                    size={'medium'}
                    variant='outlined'
                    onClick={async () => {
                        try {
                            if (!props.data.clickedCoord) return;
                            const { lat, lon } = props.data.clickedCoord;
                            const [x, y] = transform([lat, lon], 'EPSG:3857', 'EPSG:4326');
                            /* eslint-disable camelcase */
                            const params: CategorySearchParamType = {
                                category_group_code: 'SC4',
                                x: String(x),
                                y: String(y),
                                radius: bufferRadius / 2 || 500 / 2,
                            };
                            const { data } = await kakaoApis.categorySearch(params);
                            const { documents } = data;
                            setPlaceList(documents);
                            type countsObjType = { [key: string]: number };
                            const counts: countsObjType = {};
                            const coords: Coordinates[] = documents.map((e: CategorySearchResultDocumentType) => {
                                const category = e.category_name.split('>').at(-1);
                                if (!category) return;
                                if (!Object.prototype.hasOwnProperty.call(counts, category)) counts[category] = 1;
                                else counts[category] += 1;
                                return { lat: e.y, lon: e.x };
                            });
                            const labels = [...Object.keys(counts).slice(0, 6)];
                            const obj = {
                                labels,
                                datasets: [
                                    {
                                        label: '',
                                        data: [...Object.values(counts).slice(0, 6)],
                                        backgroundColor: pieChartBackgroundColors,
                                        borderColor: pieChartBorderColors,
                                        borderWidth: 2,
                                    },
                                ],
                            };
                            setPieChart(Object.assign(pieChart, obj));
                            props.schoolCoords(coords);
                        } catch (error) {
                            console.error(error);
                        }
                    }}
                >
                    검색
                </Button>
            </SearchBox>
            <ResultList>
                <h3>검색 결과</h3>
                {!placeList || (
                    <Places>
                        {placeList?.map(({ place_name: PlaceName, id }) => {
                            return <li key={id}>{PlaceName}</li>;
                        })}
                    </Places>
                )}
            </ResultList>
            <div>{pieChart.datasets[0].data.length === 0 || <Pie data={pieChart} />}</div>
        </SearchWrapper>
    );
};
