import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import TileGrid from 'ol/tilegrid/TileGrid';

import { VWORLD_API_WMTS_URL, VWORLD_API_KEY } from 'shared/constants/common';
import { BaseTileMapCodeType } from 'shared/constants/types';

export const BASE_TILE_MAP_CODE: BaseTileMapCodeType = {
    'vw.base': 0,
    'vw.satellite': 1,
    'vw.midnight': 2,
    'kakao.base': 3,
    'kakao.satellite': 4,
};

const daumTileGrid = new TileGrid({
    extent: [-30000 - 524288, -60000 - 524288, 494288 + 524288, 988576 + 524288],
    tileSize: 256,
    resolutions: [4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
    minZoom: 1,
});

function getDaumTileUrlFunction(type) {
    const tileUrlFunction = function (tileCoord, pixelRatio, projection) {
        const res = this.getTileGrid().getResolutions();
        const sVal = res[tileCoord[0]];

        const yLength = 988576 - -60000 + 524288 + 524288;
        let yTile = yLength / (sVal * this.getTileGrid().getTileSize());

        const tileGap = Math.pow(2, tileCoord[0] - 1);
        yTile = yTile - tileGap;

        const xTile = tileCoord[1] - tileGap;

        if (type == 'base') {
            return (
                'http://map' +
                Math.floor(Math.random() * (4 - 1 + 1) + 1) +
                '.daumcdn.net/map_2d_hd/2111ydg/L' +
                (15 - tileCoord[0]) +
                '/' +
                (yTile + tileCoord[2]) +
                '/' +
                xTile +
                '.png'
            );
        } else if (type == 'satellite') {
            return (
                'https://map' +
                Math.floor(Math.random() * (4 - 1 + 1) + 1) +
                '.daumcdn.net/map_skyview_hd/L' +
                (15 - tileCoord[0]) +
                '/' +
                (yTile + tileCoord[2]) +
                '/' +
                xTile +
                '.jpg'
            );
        }
    };

    return tileUrlFunction;
}

const vworldWmtsUrl = `${VWORLD_API_WMTS_URL}/${VWORLD_API_KEY}`;
export const baseLayers = [
    new TileLayer({
        visible: false,
        source: new XYZ({
            projection: 'EPSG:3857',
            url: `${vworldWmtsUrl}/Base/{z}/{y}/{x}.png`,
            crossOrigin: 'anonymous',
        }),
    }),
    new TileLayer({
        visible: false,
        source: new XYZ({
            projection: 'EPSG:3857',
            url: `${vworldWmtsUrl}/Satellite/{z}/{y}/{x}.png`,
            crossOrigin: 'anonymous',
        }),
    }),
    new TileLayer({
        visible: false,
        source: new XYZ({
            projection: 'EPSG:3857',
            url: `${vworldWmtsUrl}/midnight/{z}/{y}/{x}.png`,
            crossOrigin: 'anonymous',
        }),
    }),
    new TileLayer({
        source: new XYZ({
            projection: 'EPSG:5181',
            tileGrid: daumTileGrid,
            tileUrlFunction: getDaumTileUrlFunction('base'),
            tilePixelRatio: 2,
        }),
        visible: false,
    }),
];

export const baseLayerGroup = new LayerGroup({
    layers: baseLayers,
});
