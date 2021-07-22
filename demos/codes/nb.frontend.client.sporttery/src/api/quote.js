import createAxios from './createAxios';

const axios = createAxios({ baseURL: window.NBConfig.QUOTE_URL });

export const getMultMaxBetList = () => axios.get('betQuote/getComboLimit');

export const getQuoteSingBetList = params => axios.post('quote/doQuote', params);

export const getQuoteMultBetList = params => axios.post('quote/doMutQuote', params);
