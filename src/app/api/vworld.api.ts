import axios from 'axios';

const endpoints = {
    placeSearch: (query) => {
        const queryString = `?${new URLSearchParams(query).toString()}`;
        return `http://api.vworld.kr/req/search${queryString}`;
    },
};

const searchApis = {
    placeSearch: (query) => axios.get(endpoints.placeSearch(query)),
};

export { searchApis };
