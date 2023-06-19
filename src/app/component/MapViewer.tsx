import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { LayerBox } from 'app/component/LayerBox';

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import olEvent from 'ol/events/Event';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OlGeoJSON from 'ol/format/GeoJSON';
import Select from 'ol/interaction/Select';
import { getCenter } from 'ol/extent';
import { Overlay, Feature } from 'ol';
import { Point, Circle } from 'ol/geom';
import { transform } from 'ol/proj';
import { register } from 'ol/proj/proj4';

import { baseLayers, BASE_TILE_MAP_CODE } from 'shared/constants/baseTileMap';
import { defaultStyle, markerStyle, bufferStyle } from 'shared/constants/map';
import { BaseMapTypes, Coordinates } from 'shared/constants/types';

import proj4 from 'proj4';

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
    clickedCoord?: Coordinates;
    schoolCoords?: Coordinates[];
    searchType: string;
    bufferSize: number;
}

interface MapViewerProps {
    data: MapViewerData;
    clickedPostion: (coord: Coordinates) => void;
}

export const MapViewer = (props: MapViewerProps) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [MapObj, setMapObj] = useState<Map | undefined>();
    const [popupContent, setPopupContent] = useState('');

    useEffect(() => {
        const newMap = initMap(mapRef);
        if (!newMap) return;
        newMap.getAllLayers()[0].setVisible(true);
        setMapObj(newMap);
    }, []);

    useEffect(() => {
        if (!props.data?.movedCenter || !MapObj) return;
        removeCustomLayers();
        const center: Coordinates = props.data?.movedCenter;
        const [x, y] = transform([center.lon, center.lat], 'EPSG:4326', 'EPSG:3857');
        const marker = new Feature({
            geometry: new Point([x, y]),
        });
        const markerSource = new VectorSource();
        markerSource.addFeature(marker);
        const markerLayer = new VectorLayer({ source: markerSource, style: markerStyle, name: 'marker' });

        MapObj.addLayer(markerLayer);
        MapObj.getView().setCenter([x, y]);
        MapObj.getView().setZoom(15);
        setMapObj(MapObj);
    }, [props.data.movedCenter]);

    useEffect(() => {
        if (!props.data.clickedCoord) return;
        addBufferLayer();
    }, [props.data.bufferSize, props.data.clickedCoord]);

    useEffect(() => {
        const searchType = props.data.searchType;
        if (!MapObj) return;
        removeCustomLayers();
        const fn = function (e: olEvent) {
            const [lat, lon] = e.coordinate;
            const coords = { lat, lon };
            props.clickedPostion(coords);
        };
        if (searchType === 'place') MapObj.un('click', fn);
        else MapObj.on('click', fn);
        MapObj.getAllLayers()
            .filter((layer) => layer.get('name') === 'user-layer')
            .forEach((layer) => layer.setVisible(searchType === 'place'));
    }, [props.data.searchType]);

    useEffect(() => {
        const coords = props.data.schoolCoords;
        if (!coords || !MapObj) return;
        if (!MapObj) return;
        MapObj.getAllLayers()
            .filter((layer) => layer.get('name') === 'school')
            .forEach((layer) => MapObj.removeLayer(layer));
        coords.forEach((coord) => {
            const { lat, lon } = coord;
            const [x, y] = transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
            const marker = new Feature({
                geometry: new Point([x, y]),
            });
            const markerSource = new VectorSource();
            markerSource.addFeature(marker);
            const markerLayer = new VectorLayer({ source: markerSource, style: markerStyle, name: 'school' });
            MapObj.addLayer(markerLayer);
        });
        setMapObj(MapObj);
    }, [props.data.schoolCoords]);

    function addBufferLayer() {
        const searchType = props.data.searchType;
        const clickedCoord = props.data.clickedCoord;
        if (searchType === 'place' || !MapObj || !clickedCoord) return;
        removeCustomLayers();
        const { lat, lon } = clickedCoord;
        const buffer = new Circle([lat, lon], props.data.bufferSize);
        const bufferFeature = new Feature(buffer);
        const bufferSource = new VectorSource();
        bufferSource.addFeature(bufferFeature);
        const bufferLayer = new VectorLayer({
            source: bufferSource,
            style: bufferStyle,
            name: 'buffer',
        });
        MapObj.addLayer(bufferLayer);
        setMapObj(MapObj);
    }

    function removeCustomLayers() {
        if (!MapObj) return;
        MapObj.getAllLayers()
            .filter((layer) => ['marker', 'buffer', 'school'].includes(layer.get('name')))
            .forEach((layer) => MapObj.removeLayer(layer));
    }

    function initMap(mapEl: React.MutableRefObject<HTMLDivElement | null>): Map | undefined {
        if (!mapEl.current) return;
        proj4.defs(
            'EPSG:5181',
            '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        );
        register(proj4);
        const container = document.querySelector('#popup') as HTMLInputElement;
        const overlay = new Overlay({
            id: 'feature-info',
            element: container,
            autoPan: { animation: { duration: 250 } },
        });
        const map = new Map({
            target: mapEl.current,
            view: new View({
                center: [14135546.832670415, 4513554.170055015],
                minZoom: 6,
                zoom: 10,
            }),
            overlays: [overlay],
        });
        baseLayers.forEach((layer) => map.addLayer(layer));
        return map;
    }

    const PopupElement = (
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
    );

    return (
        <>
            <MapContainer ref={mapRef} className={'map-container'} />
            {PopupElement}
            <LayerBox
                data={{ searchType: props.data.searchType }}
                changeBaseMap={(id: BaseMapTypes) => {
                    const idx = BASE_TILE_MAP_CODE[id as keyof typeof BASE_TILE_MAP_CODE];
                    if (!MapObj) return;
                    MapObj.getAllLayers().forEach((layer, i) => {
                        layer.setVisible(i === idx);
                    });
                    setMapObj(MapObj);
                }}
                addUserMap={(geojosn) => {
                    if (!MapObj) return;
                    const vectorSource = new VectorSource({
                        features: new OlGeoJSON().readFeatures(geojosn),
                    });
                    vectorSource.getFeatures().map((feature) => {
                        feature.getGeometry()?.transform('EPSG:4326', 'EPSG:3857');
                    });
                    const vectorLayer = new VectorLayer({
                        name: 'user-layer',
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
