import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { LayerBox } from 'app/component/LayerBox';

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OlGeoJSON from 'ol/format/GeoJSON';
import Select from 'ol/interaction/Select';
import { getCenter } from 'ol/extent';
import { Icon, Style } from 'ol/style.js';
import { Overlay, Feature } from 'ol';
import { get as getOlProj, Projection, addProjection } from 'ol/proj';
import { Point } from 'ol/geom';

import proj4 from 'proj4';

import { baseLayerGroup, BASE_TILE_MAP_CODE } from 'shared/constants/baseTileMap';
import { defaultStyle } from 'shared/constants/map';
import { BaseMapTypes, Coordinates } from 'shared/constants/types';
import { GeoJSON } from 'geojson';

import pin from 'assets/img/marker.svg';

const MapContainer = styled.div`
    flex: 1;
`;

const Popup = styled.div`
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 280px;
    &:after,
    &:before {
        top: 100%;
        border: solid transparent;
        content: ' ';
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }
    &:after {
        border-top-color: white;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
    }
    &:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
    }
`;

const PopupCloser = styled.a`
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
    &:after {
        content: '✖';
    }
`;

const PopupMain = styled.p`
    font-size: 0.7rem;
`;

interface MapViewerData {
    movedCenter?: Coordinates;
}

interface MapViewerProps {
    data: MapViewerData;
}

export const MapViewer = (props: MapViewerProps) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [MapObj, setMapObj] = useState<Map | undefined>();
    const [baseMapVisible, setBaseMapVisible] = useState(0);
    const [popupContent, setPopupContent] = useState('');

    useEffect(() => {
        if (!props.data?.movedCenter || !MapObj) return;
        const center: Coordinates = props.data?.movedCenter;

        const style = new Style({
            image: new Icon({ opacity: 1, scale: 1, src: pin }),
        });
        const marker = new Feature({
            geometry: new Point([center.lon, center.lat]),
        });
        const markerSource = new VectorSource();
        markerSource.addFeature(marker);
        const markerLayer = new VectorLayer({
            source: markerSource,
            style: style,
            name: 'marker',
        });
        MapObj.getAllLayers()
            .filter((layer) => layer.get('name') === 'marker')
            .forEach((layer) => MapObj.removeLayer(layer));
        MapObj.addLayer(markerLayer);
        MapObj.getView().setCenter([center.lon, center.lat]);
        MapObj.getView().setZoom(15);
        setMapObj(MapObj);
    }, [props.data.movedCenter]);

    function setProj() {
        const code = 'EPSG:5181';
        const proj = '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs';
        proj4.defs(code, proj);

        proj4.defs(
            'EPSG:3857',
            '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs',
        );

        proj4.defs(
            'EPSG:5179',
            '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        );

        const olProj = getOlProj('EPSG:4326');
        const addedProj = new Projection({
            code: code,
            units: 'm',
            extent: [-30000 - 524288, -60000 - 524288, 494288 + 524288, 988576 + 524288],
        });
        addProjection(addedProj);

        // proj4.defs(
        //     'EPSG:5181',
        //     '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs',
        // );
    }

    function initMap(mapEl: React.MutableRefObject<HTMLDivElement | null>): Map | undefined {
        if (!mapEl.current) return;
        setProj();
        const container = document.querySelector('#popup') as HTMLInputElement;
        const overlay = new Overlay({
            id: 'feature-info',
            element: container,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
        });

        const view = new View({
            projection: 'EPSG:4326',
            center: [126.9779692, 37.566535],
            zoom: 15,
        });

        const map = new Map({ layers: [baseLayerGroup], overlays: [overlay], view, controls: [] });
        map.setTarget(mapEl.current);
        return map;
    }

    useEffect(() => {
        const newMap = initMap(mapRef);
        if (!newMap) return;
        newMap.getAllLayers()[0].setVisible(true);
        setMapObj(newMap);
    }, []);

    return (
        <>
            <MapContainer ref={mapRef} className={'map-container'} />
            <Popup id='popup'>
                <PopupCloser
                    onClick={() => {
                        if (!MapObj) return;
                        const overlay = MapObj.getOverlayById('feature-info');
                        overlay.setPosition(undefined);
                        setPopupContent('');
                    }}
                />
                <PopupMain>지역명(코드): {popupContent}</PopupMain>
            </Popup>
            <LayerBox
                changeBaseMap={(type: BaseMapTypes) => {
                    if (!MapObj) return;
                    const idx = BASE_TILE_MAP_CODE[type];
                    MapObj.getAllLayers()[baseMapVisible].setVisible(false);
                    MapObj.getAllLayers()[idx].setVisible(true);
                    setMapObj(MapObj);
                    setBaseMapVisible(idx);
                }}
                addUserMap={(geojosn: GeoJSON) => {
                    if (!MapObj) return;
                    const vectorSource = new VectorSource({
                        features: new OlGeoJSON().readFeatures(geojosn),
                    });
                    const vectorLayer = new VectorLayer({
                        source: vectorSource,
                        style: () => defaultStyle,
                    });
                    MapObj.addLayer(vectorLayer);
                    const select = new Select({
                        layers: [vectorLayer],
                        filter: function (feature, layer) {
                            if (vectorLayer === layer) {
                                const extent = feature.getGeometry()?.getExtent();
                                if (!extent) return false;
                                const coords = getCenter(extent);
                                const overlay = MapObj.getOverlayById('feature-info');
                                overlay.setPosition(coords);
                                const name = feature.get('SIG_KOR_NM');
                                const code = feature.get('SIG_CD');
                                setPopupContent(`${name}(${code})`);
                                return true;
                            }
                            return false;
                        },
                    });
                    MapObj.addInteraction(select);
                    setMapObj(MapObj);
                }}
            />
        </>
    );
};
