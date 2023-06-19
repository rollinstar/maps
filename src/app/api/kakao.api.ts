import axios from 'axios';

const headers = { Authorization: 'KakaoAK 588eed82eac884986dbc5884fdcfd3c5' };

type CategoryGroupCode = 'MT1' | 'SC4' | 'CS2';

interface PlaceSearchParamType {
    query: string;
}
interface CategorySearchParamType {
    category_group_code: CategoryGroupCode;
    x: string;
    y: string;
    radius: number;
}

interface CategorySearchResultDocumentType {
    id: string;
    place_name: string;
    category_name: string;
    category_group_code: string;
    category_group_name: string;
    phone: string;
    address_name: string;
    road_address_name: string;
    x: string;
    y: string;
    place_url: string;
    distance: string;
}

interface CategorySearchResultType {
    documents: CategorySearchResultDocumentType[];
}

const endpoints = {
    placeSearch: (params: PlaceSearchParamType) => {
        const queryString = `?${new URLSearchParams(params).toString()}`;
        return `https://dapi.kakao.com/v2/local/search/keyword.json${queryString}`;
    },
    categorySearch: (params: CategorySearchParamType) => {
        const queryString = `?${new URLSearchParams(params).toString()}`;
        return `https://dapi.kakao.com/v2/local/search/category.json${queryString}`;
    },
};

const kakaoApis = {
    placeSearch: (params: PlaceSearchParamType) => axios.get(endpoints.placeSearch(params), { headers }),
    categorySearch: (params: CategorySearchParamType) => axios.get(endpoints.categorySearch(params), { headers }),
};

export {
    kakaoApis,
    PlaceSearchParamType,
    CategorySearchParamType,
    CategorySearchResultType,
    CategorySearchResultDocumentType,
};
