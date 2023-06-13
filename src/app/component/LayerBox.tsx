import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ToggleButton } from 'app/component/common-ui/index';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faFileImport } from '@fortawesome/free-solid-svg-icons';

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

const MapSelector = styled.div`
    padding: 10px;
    border-top: 1px var(--border-color) solid;
`;

export const LayerBox = () => {
    const [isOpen, setIsOpen] = useState(true);

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
                <MapSelector>
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
                    />
                </MapSelector>
                <MapSelector>
                    <h4>배경지도</h4>
                    <FontAwesomeIcon icon={faFileImport} color={'#718096'} />
                </MapSelector>
            </LayerControl>
        </LayerBoxWrapper>
    );
};
