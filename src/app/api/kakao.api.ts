import axios from 'axios';

const headers = { Authorization: 'KakaoAK 588eed82eac884986dbc5884fdcfd3c5' };

const endpoints = {
    placeSearch: (query) => {
        const queryString = `?${new URLSearchParams(query).toString()}`;
        return `https://dapi.kakao.com/v2/local/search/keyword.json${queryString}`;
    },
};

const kakaoApis = {
    placeSearch: (query) => axios.get(endpoints.placeSearch(query), { headers }),
};

export { kakaoApis };
