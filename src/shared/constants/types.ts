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

export interface PlaceListType {
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
