import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ToggleButton } from 'app/component/common-ui/index';

import shp from 'shpjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faFileImport } from '@fortawesome/free-solid-svg-icons';

import { GeoJSON } from 'geojson';

import { BaseMapTypes } from 'shared/constants/types';

const LayerBoxWrapper = styled.div`
    position: fixed;
    top: 20px;
    right: 20px;
    width: 450px;
    border: 1px var(--border-color) solid;
    border-radius: 8px;
    background-color: var(--primary-white);
    padding: 5px 20px;
`;

const LayerBoxTitleBar = styled.div`
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    svg {
        margin-left: auto;
        cursor: pointer;
    }
`;

const LayerControl = styled.div`
    margin-top: 5px;
    &.closed {
        visibility: hidden;
        height: 0;
        margin: 0;
    }
`;

const MapSelectBox = styled.div`
    padding: 10px;
    border-top: 1px var(--border-color) solid;
`;

const MapSelectBoxHeader = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    svg {
        margin-left: auto;
        cursor: pointer;
    }
`;

const MapFileInput = styled.input`
    display: none;
`;

const UserLayerList = styled.div`
    margin-top: 5px;
    padding: 4px;
    ul {
        li {
            font-size: 0.8rem;
            border-bottom: 1px var(--border-color) solid;
            padding: 4px 10px;
            cursor: pointer;
            &:hover {
                background-color: rgba(0, 89, 223, 0.08);
                color: #0059df;
            }
        }
    }
`;

interface LayerBoxProps {
    data: {
        searchType: string;
    };
    changeBaseMap: (id: BaseMapTypes) => void;
    addUserMap: (geojson: GeoJSON) => void;
}

export const LayerBox = (props: LayerBoxProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const [layerList, setLayerList] = useState<string[]>([]);

    useEffect(() => {
        return () => {
            const fileInput = document.querySelector('#user_map_selector') as HTMLInputElement;
            fileInput.value = '';
        };
    }, []);

    return (
        <LayerBoxWrapper>
            <LayerBoxTitleBar>
                <h3>지도 선택</h3>

                <FontAwesomeIcon
                    icon={isOpen ? faAngleUp : faAngleDown}
                    color={'#718096'}
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                />
            </LayerBoxTitleBar>
            <LayerControl className={isOpen ? '' : 'closed'}>
                <MapSelectBox>
                    <h4>배경지도</h4>
                    <ToggleButton
                        items={[
                            { value: 'vw.base', label: 'vWorld일반' },
                            { value: 'vw.satellite', label: 'vWorld영상' },
                            { value: 'vw.midnight', label: 'vWorld야간' },
                            { value: 'kakao.base', label: '카카오일반' },
                            { value: 'kakao.satellite', label: '카카오영상' },
                        ]}
                        defaultValue='vw.base'
                        onBtnChanged={(selected) => {
                            const baseMap = String(selected) as BaseMapTypes;
                            props.changeBaseMap(baseMap);
                        }}
                    />
                </MapSelectBox>
                <MapSelectBox>
                    <MapSelectBoxHeader>
                        <h4>사용자 지도</h4>
                        {props.data.searchType === 'spatial' || (
                            <FontAwesomeIcon
                                icon={faFileImport}
                                color={'#718096'}
                                onClick={() => {
                                    const id = '#user_map_selector';
                                    const fileInput = document.querySelector(id) as HTMLInputElement;
                                    fileInput.click();
                                }}
                            />
                        )}
                        <MapFileInput
                            id='user_map_selector'
                            type='file'
                            accept='.shp, .dbf, .cpg'
                            onChange={async (e) => {
                                const files = e.target.files;
                                if (files === null) return;
                                let shpFile: ArrayBuffer | null = null;
                                let dbfFile: ArrayBuffer | null = null;
                                let cpgFile: ArrayBuffer | null = null;
                                [...files].forEach(async (f) => {
                                    const { name } = f;
                                    const ext = name.split('.').at(-1);
                                    if (ext === 'shp') shpFile = await new Blob([f]).arrayBuffer();
                                    else if (ext === 'dbf') dbfFile = await new Blob([f]).arrayBuffer();
                                    else if (ext === 'cpg') cpgFile = await new Blob([f]).arrayBuffer();
                                    if (shpFile && dbfFile && cpgFile) {
                                        const geojson = shp.combine([
                                            shp.parseShp(shpFile, 'EPSG:4326'),
                                            shp.parseDbf(dbfFile, cpgFile),
                                        ]);
                                        setLayerList([...layerList, name]);
                                        props.addUserMap(geojson);
                                    }
                                });
                            }}
                            multiple
                        />
                    </MapSelectBoxHeader>
                    <UserLayerList>
                        <ul>
                            {layerList.map((layer) => {
                                return <li key={layer}>{layer}</li>;
                            })}
                        </ul>
                    </UserLayerList>
                </MapSelectBox>
            </LayerControl>
        </LayerBoxWrapper>
    );
};
