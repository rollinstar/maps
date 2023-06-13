import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';

const MapContainer = styled.div`
    flex: 1;
`;

export const MapViewer = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [MapObj, setMapObj] = useState({});

    useEffect(() => {
        if (!mapRef.current) return;

        const initalFeaturesLayer = new VectorLayer({
            source: new VectorSource(),
        });

        const initialMap = new Map({
            target: mapRef.current,
            layers: [
                // USGS Topo
                new TileLayer({
                    source: new XYZ({
                        url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
                    }),
                }),
                initalFeaturesLayer,
            ],
            view: new View({
                projection: 'EPSG:3857',
                center: [0, 0],
                zoom: 2,
            }),
            controls: [],
        });

        // save map and vector layer references to state
        setMapObj(initialMap);
    }, []);

    return <MapContainer ref={mapRef} className={'map-container'} />;
};
