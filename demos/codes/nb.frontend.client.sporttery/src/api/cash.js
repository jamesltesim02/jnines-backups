import createAxios from './createAxios';

const axios = createAxios({ baseURL: window.NBConfig.CASH_URL });

export const checkCashList = params => axios.post('cashout/checkCashout', params);

export const setCashList = params => axios.post('cashout/cashout', params);
