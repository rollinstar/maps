import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import TileGrid from 'ol/tilegrid/TileGrid';
import Projection from 'ol/proj/Projection';

import { VWORLD_API_WMTS_URL } from 'shared/constants/common';
import { BaseTileMapCodeType } from 'shared/constants/types';

export const BASE_TILE_MAP_CODE: BaseTileMapCodeType = {
    'vw.base': 0,
    'vw.satellite': 1,
    'vw.midnight': 2,
    'kakao.base': 3,
    'kakao.satellite': 4,
};

const vworldWmtsUrl = `${VWORLD_API_WMTS_URL}/4C0C82D8-FEA1-381E-8C4E-E84E1BE3996A`;
export const baseLayers = [
    new TileLayer({
        visible: false,
        source: new XYZ({
            url: `${vworldWmtsUrl}/Base/{z}/{y}/{x}.png`,
        }),
    }),
    new TileLayer({
        visible: false,
        source: new XYZ({
            url: `${vworldWmtsUrl}/Satellite/{z}/{y}/{x}.jpeg`,
        }),
    }),
    new TileLayer({
        visible: false,
        source: new XYZ({
            url: `${vworldWmtsUrl}/midnight/{z}/{y}/{x}.png`,
        }),
    }),
    new TileLayer({
        source: new XYZ({
            projection: new Projection({
                code: 'EPSG:5181',
                extent: [-30000, -60000, 494288, 988576],
                units: 'm',
            }),
            tileGrid: new TileGrid({
                origin: [-30000, -60000],
                resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
            }),
            tileUrlFunction: function (coord) {
                console.log(coord);
                const type = 'base';
                const resolutions = this.getTileGrid().getResolutions();
                const n = Math.floor(Math.random() * 4);
                const z = resolutions.length - coord[0];
                const x = coord[1];
                const y = coord[2];
                // const tile = type === 'base' ? 'map_2d_hd' : 'map_skyview_hd';
                const ext = type === 'base' ? '.png' : '.jpg';
                const url = `http://map${n}.daumcdn.net/map_2d_hd/2111ydg/L${z}/${y}/${x}${ext}`;
                console.log(url);
                return url;
            },
            tileSize: 256,
            minZoom: 1,
        }),
        visible: false,
    }),
    new TileLayer({
        visible: false,
        source: new XYZ({
            url: `${vworldWmtsUrl}/Base/{z}/{y}/{x}.png`,
            crossOrigin: 'anonymous',
        }),
    }),
];

export const baseLayerGroup = new LayerGroup({
    layers: baseLayers,
});
