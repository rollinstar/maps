export type BaseMapTypes = 'vw.base' | 'vw.satellite' | 'vw.midnight' | 'kakao.base' | 'kakao.satellite';
export type MapSearchType = 'place' | 'spatial';

export interface Coordinates {
    lat: number;
    lon: number;
}

export interface BaseTileMapCodeType {
    'vw.base': number;
    'vw.satellite': number;
    'vw.midnight': number;
    'kakao.base': number;
    'kakao.satellite': number;
}
